/* eslint-disable default-case */
import * as action from "../actions/salesActions";
import produce from "immer";
import drafts from "./drafts";
import { SalesState, ISale } from "../types";
import { AnyAction } from "redux";
import { insertIntoArray } from "../util";

const initialState = drafts.initializeState({
  sales: [],
  currentSale: {}
});

export default (
  state: SalesState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_SALES_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_SALES_SUCCESS:
        return drafts.loadSuccess(draft, "sales", payload);

      case action.LOAD_SALES_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_SALES_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_SALES_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_SALES_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.CREATE_SALE:
        draft.currentSale = payload as ISale;
        draft.currentSale.saleID = state.currentID + 1;
        break;

      case action.SAVE_CREATED_SALE:
        draft.sales.push(payload);
        draft.currentSale = null;
        draft.isSaved = false;
        draft.currentID = payload.saleID;
        break;

      case action.EDIT_SALE:
        draft.currentSale = state.sales.find(
          sale => sale.saleID === payload
        ) as ISale;
        break;

      case action.SAVE_EDITED_SALE:
        let newArray = state.sales.map(sale => {
          if (sale.saleID === payload.saleID) {
            return payload;
          } else {
            return sale;
          }
        });
        draft.sales = newArray;
        draft.currentSale = null;
        draft.isSaved = false;
        break;

      case action.CLEAR_CURRENT_SALE:
        draft.currentSale = null;
        break;

      case action.SEND_SALE:
        let saleIndex: number = 0;
        let sent: ISale | any = state.sales.find((sale, index) => {
          if (sale.saleID === payload.id) {
            saleIndex = index;
          }
          return sale.saleID === payload.id;
        });
        sent.dateSent = payload.date;
        draft.history.push(sent);
        draft.sales.splice(saleIndex, 1);
        draft.isSaved = false;
        break;

      case action.DELETE_SALE:
        //ADD SALE TO HISTORY AS DELETED
        let saleToDelete = state.sales.find(
          sale => sale.saleID === payload
        ) as ISale;
        saleToDelete.isDeleted = true;
        let deleteHistoryIndex: number = 0;
        for (let i = 0; i < draft.history.length; i++) {
          if (
            draft.sales[i].saleID > saleToDelete.saleID ||
            i === draft.history.length - 1
          ) {
            deleteHistoryIndex = i;
            break;
          }
        }
        draft.history.splice(deleteHistoryIndex, 0, saleToDelete);

        //REMOVE SALE FROM SALES
        let deletedArray = state.sales.filter(sale => sale.saleID !== payload);
        draft.sales = deletedArray;
        draft.isSaved = false;
        break;

      case action.RESET_SALES:
        return drafts.resetReducer(initialState);

      case action.UNDO_SALE:
        //FIND SALE AND REMOVE FROM HISTORY
        let historyIndex: number = 0;
        let saleToUndo = state.history.find((sale, index) => {
          if (sale.saleID === payload) {
            historyIndex = index;
          }
          return sale.saleID === payload;
        }) as ISale;
        draft.history.splice(historyIndex, 1);
        saleToUndo.dateSent = null;
        saleToUndo.isDeleted = false;

        //INSERT SALE TO SALES
        draft.sales = insertIntoArray(state.sales, saleToUndo, "saleID");
        draft.isSaved = false;
        break;

      case action.TOGGLE_SALE_READY:
        let salesWithToggled = state.sales.map(sale => {
          if (sale.saleID === payload) {
            const isReady = sale.isReady || false;
            return { ...sale, isReady: !isReady };
          } else {
            return sale;
          }
        });
        draft.sales = salesWithToggled;
        draft.isSaved = false;
        break;
    }
  });
