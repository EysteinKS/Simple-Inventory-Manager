import { useDispatch, useSelector } from "react-redux";
import { ILoan, RootState, IOrderedProduct, IChangeValue } from "../types";
import * as actions from "../actions/loansActions";
import { addChange } from "../actions/reportsActions";
import { useMemo } from "react";
import { addNotification, notifications } from "../actions/notificationActions";

const newLoan = (id: number): ILoan => {
  let date = new Date();
  return {
    loanID: id,
    customerID: 1,
    dateOrdered: date,
    dateSent: null,
    dateReceived: null,
    ordered: [],
    isNew: true
  };
};

const useLoans = () => {
  const dispatch = useDispatch();
  const currentID = useSelector((state: RootState) => state.loans.currentID);
  const memoizedID = useMemo(() => currentID, [currentID]);

  const createNewLoan = () =>
    dispatch(actions.createLoan(newLoan(memoizedID + 1)));
  const editLoan = (id: number) => dispatch(actions.editLoan(id));
  const clearCurrentLoan = () => dispatch(actions.clearCurrentLoan());

  const saveCreatedLoan = (loan: ILoan) => {
    dispatch(
      addChange({
        type: "NEW_LOAN",
        id: loan.loanID,
        section: "loans"
      })
    );
    dispatch(actions.saveCreatedLoan(loan));
    dispatch(addNotification(notifications.addedChange()));
  };

  const saveEditedLoan = (loan: ILoan, changed: IChangeValue[]) => {
    dispatch(
      addChange({
        type: "EDIT_LOAN_INFO",
        id: loan.loanID,
        section: "loans",
        changed
      })
    );
    dispatch(actions.saveEditedLoan(loan));
    dispatch(addNotification(notifications.addedChange()));
  };

  const deleteLoan = (id: number) => {
    dispatch(
      addChange({
        type: "DELETE_LOAN",
        id,
        section: "loans"
      })
    );
    dispatch(actions.deleteLoan(id));
    dispatch(addNotification(notifications.addedChange()));
  };

  const sentLoan = (id: number, ordered: IOrderedProduct[], date: Date) => {
    dispatch(
      addChange({
        type: "SENT_LOAN",
        id,
        section: "loans"
      })
    );
    dispatch(actions.didSendLoan(id, ordered, date));
    dispatch(addNotification(notifications.addedChange()));
  };

  const receivedLoan = (id: number, ordered: IOrderedProduct[], date: Date) => {
    dispatch(
      addChange({
        type: "RECEIVED_LOAN",
        id,
        section: "loans"
      })
    );
    dispatch(actions.didReceiveLoan(id, ordered, date));
    dispatch(addNotification(notifications.addedChange()));
  };

  return {
    createNewLoan,
    editLoan,
    clearCurrentLoan,
    saveCreatedLoan,
    saveEditedLoan,
    deleteLoan,
    sentLoan,
    receivedLoan
  };
};

export default useLoans;
