/* eslint-disable default-case */
import * as action from "../actions/salesActions"
import produce from "immer"
import drafts from "./drafts"
import { SalesState, ISale } from "../types";
import { AnyAction } from "redux";

const initialState = drafts.initializeState({
  sales: [],
  sortedSales: [],
  currentSale: {}
})

export default (state: SalesState = initialState, {type, payload}: AnyAction) => 
  produce(state, draft => {
    switch(type){
      case action.LOAD_SALES_BEGIN:
        return drafts.loadBegin(draft)
      case action.LOAD_SALES_SUCCESS:
        return drafts.loadSuccess(
          draft,
          ["sales", "sortedSales"],
          payload
        )
      case action.LOAD_SALES_FAILURE:
        return drafts.loadFailure(draft, payload)
      case action.SAVE_SALES_BEGIN:
        return drafts.saveBegin(draft)
      case action.SAVE_SALES_SUCCESS:
        return drafts.saveSuccess(draft)
      case action.SAVE_SALES_FAILURE:
        return drafts.saveFailure(draft, payload)
      case action.CREATE_SALE:
        draft.currentSale = payload
        draft.currentSale.saleID = state.currentID + 1
        break
      case action.SAVE_CREATED_SALE:
        draft.sales.push(payload)
        draft.sortedSales.push(payload)
        draft.currentSale = {}
        draft.isSaved = false
        draft.currentID = payload.saleID
        break
      case action.EDIT_SALE:
        draft.currentSale = state.sales.find(sale => sale.saleID === payload)
        break
      case action.SAVE_EDITED_SALE:
        let newArray = state.sales.map(sale => {
          if(sale.saleID === payload.saleID){
            return payload
          } else {
            return sale
          }
        })
        draft.sales = newArray
        draft.sortedSales = newArray
        draft.currentSale = {};
        draft.isSaved = false;
        break;
      case action.CLEAR_CURRENT_SALE:
        draft.currentSale = {}
        break
      case action.SEND_SALE:
        let saleIndex: number = 0
        let sent: ISale | any = state.sales.find((sale, index) => {
          if(sale.saleID === payload){
            saleIndex = index
          }
          return (sale.saleID === payload)
        })
        sent.dateSent = new Date()
        draft.history.push(sent)
        draft.sales.splice(saleIndex, 1)
        draft.sortedSales = draft.sales
        draft.isSaved = false
        break
      case action.DELETE_SALE:
        let deletedArray = state.sales.filter(sale => sale.saleID !== payload)
        draft.sales = deletedArray
        draft.sortedSales = deletedArray
        draft.isSaved = false;
        break;
      case action.RESET_SALES:
        return drafts.resetReducer(initialState)
    }
  })
