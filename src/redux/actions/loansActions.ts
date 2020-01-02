import { ILoan, LoansState, IOrderedProduct } from "../types";
import {
  getSectionFromFirestore,
  convertTimestampsToDates,
  setSectionToFirestore
} from "../middleware/thunks";
import { IThunkAction } from "../middleware/types";
import { updateProductAmount } from "./productsActions";

const thisSection = "loans";

export const LOAD_LOANS_BEGIN = "LOAD_LOANS_BEGIN";
export const loadLoansBegin = () => ({
  type: LOAD_LOANS_BEGIN
});

export const LOAD_LOANS_SUCCESS = "LOAD_LOANS_SUCCESS";
type TLoadLoansSuccess = {
  newLoans: ILoan[];
  sentLoans: ILoan[];
  history: ILoan[];
  currentID: number;
};
export const loadLoansSuccess = (payload: TLoadLoansSuccess) => ({
  type: LOAD_LOANS_SUCCESS,
  payload: payload
});

export const LOAD_LOANS_FAILURE = "LOAD_LOANS_FAILURE";
export const loadLoansFailure = (error: string) => ({
  type: LOAD_LOANS_FAILURE,
  payload: error
});

export const loadLoans = () =>
  getSectionFromFirestore(
    thisSection,
    loadLoansBegin,
    loadLoansSuccess,
    loadLoansFailure,
    data => {
      let loans = convertTimestampsToDates(data.loans, [
        "dateOrdered",
        "dateSent"
      ]);
      let history = convertTimestampsToDates(data.history, [
        "dateOrdered",
        "dateSent",
        "dateReceived"
      ]);
      return {
        loans,
        history,
        currentID: data.currentID
      };
    }
  );

export const SAVE_LOANS_BEGIN = "SAVE_LOANS_BEGIN";
export const saveLoansBegin = () => ({
  type: SAVE_LOANS_BEGIN
});

export const SAVE_LOANS_SUCCESS = "SAVE_LOANS_SUCCESS";
export const saveLoansSuccess = () => ({
  type: SAVE_LOANS_SUCCESS
});

export const SAVE_LOANS_FAILURE = "SAVE_LOANS_FAILURE";
export const saveLoansFailure = (error: string) => ({
  type: SAVE_LOANS_FAILURE,
  payload: error
});

export const saveLoans = (date: Date) =>
  setSectionToFirestore(
    date,
    thisSection,
    saveLoansBegin,
    saveLoansSuccess,
    saveLoansFailure,
    state => {
      let l = state.loans as LoansState;
      let loans = convertTimestampsToDates(l.loans, [
        "dateOrdered",
        "dateSent"
      ]);
      let history = convertTimestampsToDates(l.history, [
        "dateOrdered",
        "dateSent",
        "dateReceived"
      ]);
      return {
        loans,
        history,
        currentID: l.currentID
      };
    }
  );

export const CREATE_LOAN = "CREATE_LOAN";
export const createLoan = (initializedLoan: ILoan) => ({
  type: CREATE_LOAN,
  payload: initializedLoan
});

export const SAVE_CREATED_LOAN = "SAVE_CREATED_LOAN";
export const saveCreatedLoan = (created: ILoan) => ({
  type: SAVE_CREATED_LOAN,
  payload: created
});

export const EDIT_LOAN = "EDIT_LOAN";
export const editLoan = (id: number) => ({
  type: EDIT_LOAN,
  payload: id
});

export const SAVE_EDITED_LOAN = "SAVE_EDITED_LOAN";
export const saveEditedLoan = (loan: ILoan) => ({
  type: SAVE_EDITED_LOAN,
  payload: loan
});

export const CLEAR_CURRENT_LOAN = "CLEAR_CURRENT_LOAN";
export const clearCurrentLoan = () => ({
  type: CLEAR_CURRENT_LOAN
});

export const SEND_LOAN = "SEND_LOAN";
export const sendLoan = (id: number, date: Date) => ({
  type: SEND_LOAN,
  payload: { id, date }
});

export const didSendLoan = (
  id: number,
  ordered: IOrderedProduct[],
  date: Date
): IThunkAction => async dispatch => {
  ordered.forEach(product => {
    dispatch(updateProductAmount(product.productID, -Math.abs(product.amount)));
  });
  dispatch(sendLoan(id, date));
};

export const RECEIVED_LOAN = "RECEIVED_LOAN";
export const receivedLoan = (id: number, date: Date) => ({
  type: RECEIVED_LOAN,
  payload: { id, date }
});

export const didReceiveLoan = (
  id: number,
  ordered: IOrderedProduct[],
  date: Date
): IThunkAction => async dispatch => {
  ordered.forEach(product => {
    dispatch(updateProductAmount(product.productID, product.amount));
  });
  dispatch(receivedLoan(id, date));
};

export const DELETE_LOAN = "DELETE_LOAN";
export const deleteLoan = (id: number) => ({
  type: DELETE_LOAN,
  payload: id
});

export const RESET_LOANS = "RESET_LOANS";
export const resetLoans = () => ({
  type: RESET_LOANS
});
