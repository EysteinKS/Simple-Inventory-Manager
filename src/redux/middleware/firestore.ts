import {
  getAllStorage,
  authKey,
  sectionKeys,
  setLocalStorage,
  ISectionKeys,
  //eslint-disable-next-line
  clearLocalStorage
} from "./localStorage";
import { fsActions, lsBeginActions, lsSuccessActions } from "../actions";

import { RootState } from "../types";
import { TDispatch, IThunkAction } from "./types";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { shouldLog } from "../../constants/util";

export const sections = {
  categories: "Categories",
  customers: "Customers",
  orders: "Orders",
  products: "Products",
  sales: "Sales",
  suppliers: "Suppliers",
  loans: "Loans"
};

export const getInventory = (message: Function): IThunkAction => {
  return async (dispatch, getState) => {
    let state = getState();
    let fsLastChanged = state.auth.location.lastChanged;
    let ls = getAllStorage() as RootState;

    shouldLog("localStorage data: ", ls);
    //If no localstorage data
    if (!ls || !("location" in ls.auth)) {
      getAllFromFirestore(sectionKeys, dispatch, message);
      setLocalStorage(authKey, { location: { lastChanged: fsLastChanged } });
      return;
    }
    let lsLastChanged = ls.auth.location.lastChanged;

    let localStorageToTimeString = new Date(lsLastChanged.global).toString();
    let firestoreToTimeString = fsLastChanged.global.toString();
    if (firestoreToTimeString === localStorageToTimeString) {
      return getAllFromLocalStorage(sectionKeys, dispatch, ls, message);
    }

    //Check which values are changed
    let isChanged = [];
    let isUnchanged = [];
    shouldLog("Checking for changes in firestore...");
    for (let k in fsLastChanged.sections) {
      let fsDateToString = fsLastChanged.sections[k].toString();
      let lsDateToString = new Date(lsLastChanged.sections[k]).toString();

      if (fsDateToString === lsDateToString) {
        isUnchanged.push(k);
      } else {
        isChanged.push(k);
      }
    }

    if (
      isChanged.length &&
      isChanged.length === Object.keys(fsActions).length
    ) {
      getAllFromFirestore(sectionKeys, dispatch, message);
      setLocalStorage(authKey, { location: { lastChanged: fsLastChanged } });
      return;
    }

    if (isUnchanged.length) {
      isUnchanged.forEach(k => {
        localDataFromKey(k, dispatch, ls, message);
      });
    }
    if (isChanged.length) {
      isChanged.forEach(k => {
        firestoreDataFromKey(k, dispatch, message);
      });
    }
    setLocalStorage(authKey, { location: { lastChanged: fsLastChanged } });
  };
};

const firestoreDataFromKey = (
  key: string,
  dispatch: ThunkDispatch<any, any, AnyAction>,
  message: Function
) => {
  message(`Loading data from firestore...`);
  let load = fsActions[key];
  dispatch(load());
};

const localDataFromKey = (
  key: string,
  dispatch: TDispatch,
  localStorage: RootState,
  message: Function
) => {
  message(`Loading data from localStorage...`);
  let begin = lsBeginActions[key];
  dispatch(begin());
  let dataFromLocalStorage = localStorage[key];
  let success = lsSuccessActions[key];
  dispatch(success(dataFromLocalStorage));
};

const getAllFromLocalStorage = (
  keys: ISectionKeys,
  dispatch: TDispatch,
  localStorage: RootState,
  message: Function
) => {
  shouldLog("Getting all data from localStorage");
  Object.keys(keys).forEach(k => {
    localDataFromKey(k, dispatch, localStorage, message);
  });
};

const getAllFromFirestore = (
  keys: ISectionKeys,
  dispatch: TDispatch,
  message: Function
) => {
  shouldLog("Getting all data from firestore");
  Object.keys(keys).forEach(k => {
    firestoreDataFromKey(k, dispatch, message);
  });
};
