/* eslint-disable default-case*/
import * as action from "../actions/customersActions";
import produce from "immer";
import drafts from "./drafts";
import { AnyAction } from "redux";
import { CustomersState } from "../types";

const initialState: CustomersState = drafts.initializeState({ customers: [] });

export default (
  state: CustomersState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_CUSTOMERS_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_CUSTOMERS_SUCCESS:
        return drafts.loadSuccess(draft, "customers", payload);

      case action.LOAD_CUSTOMERS_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_CUSTOMERS_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_CUSTOMERS_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_CUSTOMERS_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.SAVE_CREATED_CUSTOMER:
        let newID = draft.customers.length + 1;
        draft.currentID = newID;
        draft.customers.push({
          customerID: newID,
          name: payload
        });

        draft.isSaved = false;
        return draft;

      case action.SAVE_EDITED_CUSTOMER:
        let customerIndex = draft.customers.findIndex(
          c => c.customerID === payload.customerID
        );
        draft.customers[customerIndex] = payload;
        draft.isSaved = false;
        return draft;

      case action.RESET_CUSTOMERS:
        return drafts.resetReducer(initialState);
    }
  });
