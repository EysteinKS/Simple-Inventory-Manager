/* eslint-disable default-case*/
import * as action from "../actions/customersActions"
import produce from "immer"
import drafts from "./drafts"

export default (state = drafts.initializeState({customers: []}), {type, payload}) => 
  produce(state, draft => {
    switch(type){
      case action.LOAD_CUSTOMERS_BEGIN:
        return drafts.loadBegin(draft)
      case action.LOAD_CUSTOMERS_SUCCESS:
        drafts.loadSuccess(draft, "customers", payload.customers)
        draft.currentID = payload.currentID
        break;
      case action.LOAD_CUSTOMERS_FAILURE:
        return drafts.loadFailure(draft, payload)
      case action.SAVE_CUSTOMERS_BEGIN:
        return drafts.saveBegin(draft)
      case action.SAVE_CUSTOMERS_SUCCESS:
        return drafts.saveSuccess(draft)
      case action.SAVE_CUSTOMERS_FAILURE:
        return drafts.saveFailure(draft, payload)
      case action.SAVE_CREATED_CUSTOMER:
        draft.customers.push({
          customerID: draft.customers.length + 1,
          name: payload
        })
        break
    }  
})