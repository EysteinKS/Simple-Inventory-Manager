/* eslint-disable default-case*/
import * as action from "../actions/suppliersActions";
import produce from "immer";
import drafts from "./drafts";
import { SuppliersState } from "../types";
import { AnyAction } from "redux";

const initialState = drafts.initializeState({ suppliers: [] });

export default (
  state: SuppliersState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_SUPPLIERS_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_SUPPLIERS_SUCCESS:
        return drafts.loadSuccess(draft, "suppliers", payload);

      case action.LOAD_SUPPLIERS_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_SUPPLIERS_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_SUPPLIERS_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_SUPPLIERS_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.SAVE_CREATED_SUPPLIER:
        draft.currentID = draft.suppliers.length + 1;
        draft.suppliers.push({
          supplierID: draft.suppliers.length + 1,
          name: payload,
          products: []
        });
        draft.isSaved = false;
        return draft;

      case action.SAVE_EDITED_SUPPLIER:
        let supplierIndex = draft.suppliers.findIndex(
          s => s.supplierID === payload.supplierID
        );
        draft.suppliers[supplierIndex] = payload;
        draft.isSaved = false;
        return draft;
        
      case action.RESET_SUPPLIERS:
        return drafts.resetReducer(initialState);
    }
  });
