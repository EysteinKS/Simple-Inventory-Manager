/* eslint-disable default-case*/
import * as action from "../actions/suppliersActions"
import produce from "immer"
import drafts from "./drafts"

export default (state = drafts.initializeState({suppliers: []}), {type, payload}) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_SUPPLIERS_BEGIN:
        return drafts.loadBegin(draft)
      case action.LOAD_SUPPLIERS_SUCCESS:
        return drafts.loadSuccess(draft, "suppliers", payload)
      case action.LOAD_SUPPLIERS_FAILURE:
        return drafts.loadFailure(draft, payload)
      case action.SAVE_SUPPLIERS_BEGIN:
        return drafts.saveBegin(draft)
      case action.SAVE_SUPPLIERS_SUCCESS:
        return drafts.saveSuccess(draft)
      case action.SAVE_SUPPLIERS_FAILURE:
        return drafts.saveFailure(draft, payload)
      case action.SAVE_CREATED_CATEGORY:
        draft.suppliers.push({
          categoryID: draft.suppliers.length + 1,
          name: payload
        })
        break
    }
});
