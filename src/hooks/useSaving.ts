import { RootState } from "../redux/types";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import useGate from "./useGate";
import { saveCategories } from "../redux/actions/categoriesActions";
import { saveCustomers } from "../redux/actions/customersActions";
import { saveOrders } from "../redux/actions/ordersActions";
import { saveProducts } from "../redux/actions/productsActions";
import { saveReport } from "../redux/actions/reportsActions";
import { saveSales } from "../redux/actions/salesActions";
import { saveSuppliers } from "../redux/actions/suppliersActions";
import { shouldLog } from "../constants/util";
import { saveLoans } from "../redux/actions/loansActions";
import {
  addNotification,
  notifications
} from "../redux/actions/notificationActions";
import {
  selectAutoSaveSetting,
  selectTimeToAutoSave
} from "../redux/selectors/authSelectors";

const stateKeys = [
  "categories",
  "customers",
  "orders",
  "products",
  "reports",
  "sales",
  "suppliers",
  "loans"
];

const savingActions: any = {
  categories: saveCategories,
  customers: saveCustomers,
  orders: saveOrders,
  products: saveProducts,
  sales: saveSales,
  suppliers: saveSuppliers,
  loans: saveLoans
};

interface IsavingState {
  [key: string]: {
    name: string;
    isSaving: boolean;
    isSaved: boolean;
    error: string | null;
  };
}

export default function useSaving() {
  const savingState = useSelector((state: RootState) => {
    let ret = {} as IsavingState;
    stateKeys.forEach(
      key =>
        (ret[key] = {
          name: key,
          isSaving: state[key].isSaving,
          isSaved: state[key].isSaved,
          error: state[key].savingError
        })
    );
    return ret;
  });

  const isSaving = React.useMemo(
    () => stateKeys.map(key => savingState[key].isSaving),
    [savingState]
  );
  const isSaved = React.useMemo(
    () => stateKeys.map(key => savingState[key].isSaved),
    [savingState]
  );
  const savingError = React.useMemo(
    () => stateKeys.map(key => savingState[key].error),
    [savingState]
  );

  const isSavingGate = useGate(isSaving, "OR", false);
  const isSavedGate = useGate(isSaved, "AND", true);
  const savingErrorGate = useGate(savingError, "OR", false);

  const getUnsavedSections = () => {
    let unsaved: string[] = [];
    stateKeys.forEach((key, i) => {
      if (!isSaved[i] && !isSaving[i]) {
        shouldLog(key + " is unsaved");
        unsaved.push(key);
      }
    });
    shouldLog("unsaved: ", unsaved);
    return unsaved;
  };

  const dispatch = useDispatch();
  const save = () => {
    if ((!isSavingGate && !isSavedGate) || savingErrorGate) {
      let unsavedSections = getUnsavedSections();
      shouldLog("Saving...");
      let date = new Date();
      try {
        unsavedSections.forEach(section => {
          if (section !== "reports") dispatch(savingActions[section](date));
        });
      } catch (err) {
        console.error(err);
        dispatch(addNotification(notifications.savingError()));
      }
      shouldLog("Saving report from save");
      dispatch(saveReport(date));
    }
  };

  //Autosave
  const useAutoSave = useSelector(selectAutoSaveSetting);
  const timeToAutoSave = useSelector(selectTimeToAutoSave);
  const hasNewChanges = useSelector(
    (state: RootState) => state.auth.hasNewChanges
  );
  const isDemo = useSelector((state: RootState) => state.auth.isDemo);

  const timerRef = React.useRef(null as number | null);
  const [isTimerStarted, setTimerStarted] = React.useState(false);
  const [isTimerFinished, setTimerFinished] = React.useState(true);

  React.useEffect(() => {
    if (
      useAutoSave &&
      !isTimerStarted &&
      !isSavedGate &&
      !hasNewChanges &&
      !isDemo
    ) {
      shouldLog("Starting autosave timeout...");
      setTimerStarted(true);
      timerRef.current = window.setTimeout(() => {
        save();
      }, timeToAutoSave);
      setTimerFinished(false);
    }
    //eslint-disable-next-line
  }, [useAutoSave, isSavingGate, isSavedGate, hasNewChanges]);

  //Cancel autosave if there are new changes
  React.useEffect(() => {
    if (
      useAutoSave &&
      isTimerStarted &&
      !isSavedGate &&
      hasNewChanges &&
      timerRef.current !== null
    ) {
      shouldLog("New changes found, cancelling autosave");
      setTimerStarted(false);
      setTimerFinished(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    //eslint-disable-next-line
  }, [useAutoSave, isTimerStarted, isSavedGate, hasNewChanges]);

  //Cancel autosave if setting is changed by user
  React.useEffect(() => {
    if (!useAutoSave && isTimerStarted && timerRef.current !== null) {
      shouldLog("Cancelling autosave");
      setTimerStarted(false);
      setTimerFinished(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    //eslint-disable-next-line
  }, [useAutoSave, isTimerStarted]);

  //End timeout when saved
  React.useEffect(() => {
    if (useAutoSave && !isTimerFinished && isTimerStarted && isSavedGate) {
      shouldLog("Finished timeout");
      setTimerStarted(false);
      setTimerFinished(true);
      timerRef.current && window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    //eslint-disable-next-line
  }, [useAutoSave, isTimerFinished, isTimerStarted, isSavedGate]);

  return [isSavingGate, isSavedGate, savingErrorGate, save];
}
