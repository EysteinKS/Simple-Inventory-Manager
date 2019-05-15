/* eslint-disable default-case */
import * as action from "../actions/salesActions"
import produce from "immer"
import drafts from "./drafts"

export default (state = drafts.initializeState({
  sales: [],
  sortedSales: [],
  currentSale: {}
}), {type, payload}) => 
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
        break
      case action.SAVE_CREATED_SALE:
        draft.sales.push(payload)
        draft.sortedSales.push(payload)
        draft.currentSale = {}
        draft.isSaved = false
        break
      case action.EDIT_SALE:
        draft.currentSale = state.sales[payload -1]
        break
      case action.SAVE_EDITED_SALE:
        draft.sales[payload.saleID - 1] = payload
        draft.sortedSales = draft.sales
        draft.currentSale = {}
        draft.isSaved = false
        break
      case action.CLEAR_CURRENT_SALE:
        draft.currentSale = {}
        break
      case action.FINISH_SALE:
        draft.sales[payload - 1].finished = true
        draft.sortedSales = draft.sales
        draft.isSaved = false
        break
    }
  })
