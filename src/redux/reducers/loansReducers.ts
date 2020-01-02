import * as action from "../actions/loansActions";
import produce from "immer";
import drafts from "./drafts";
import { LoansState, ILoan } from "../types";
import { AnyAction } from "redux";

const initialState: LoansState = {
  currentID: 0,
  loans: [],
  currentLoan: null,
  history: [],
  isLoading: false,
  isLoaded: false,
  loadingError: null,
  isSaving: false,
  isSaved: true,
  savingError: null,
  error: null
};

export default (
  state: LoansState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_LOANS_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_LOANS_SUCCESS:
        draft.isLoading = false;
        draft.isLoaded = true;
        draft.loans = payload.loans;
        draft.history = payload.history;
        draft.currentID = payload.currentID;
        return draft;

      case action.LOAD_LOANS_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_LOANS_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_LOANS_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_LOANS_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.CREATE_LOAN:
        draft.currentLoan = payload as ILoan;
        draft.currentLoan.loanID = state.currentID + 1;
        break;

      case action.SAVE_CREATED_LOAN:
        draft.loans.push(payload);
        draft.currentLoan = null;
        draft.isSaved = false;
        draft.currentID = payload.loanID;
        break;

      case action.EDIT_LOAN:
        draft.currentLoan = state.loans.find(
          loan => loan.loanID === payload
        ) as ILoan;
        break;

      case action.SAVE_EDITED_LOAN:
        let newArray = state.loans.map(loan => {
          if (loan.loanID === payload.loanID) {
            return payload;
          } else {
            return loan;
          }
        });
        draft.loans = newArray;
        draft.currentLoan = null;
        draft.isSaved = false;
        break;

      case action.CLEAR_CURRENT_LOAN:
        draft.currentLoan = null;
        break;

      case action.SEND_LOAN:
        let sent: ILoan | any = state.loans.find(
          loan => loan.loanID === payload.id
        );
        sent.dateSent = payload.date;
        draft.isSaved = false;
        break;

      case action.RECEIVED_LOAN:
        let loanIndex: number = 0;
        let received: ILoan | any = state.loans.find((loan, index) => {
          if (loan.loanID === payload.id) {
            loanIndex = index;
          }
          return loan.loanID === payload.id;
        });
        received.dateReceived = payload.date;
        draft.history.push(received);
        draft.loans.splice(loanIndex, 1);
        draft.isSaved = false;
        break;

      case action.DELETE_LOAN:
        let loanToDelete = state.loans.find(
          loan => loan.loanID === payload
        ) as ILoan;
        loanToDelete.isDeleted = true;
        let deleteHistoryIndex: number = 0;
        for (let i = 0; i < draft.history.length; i++) {
          if (
            draft.loans[i].loanID > loanToDelete.loanID ||
            i === draft.history.length - 1
          ) {
            deleteHistoryIndex = i;
            break;
          }
        }
        draft.history.splice(deleteHistoryIndex, 0, loanToDelete);

        let deletedArray = state.loans.filter(loan => loan.loanID !== payload);
        draft.loans = deletedArray;
        draft.isSaved = false;
        break;

      case action.RESET_LOANS:
        return initialState;

      default:
        return draft;
    }
  });
