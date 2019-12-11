/* eslint-disable default-case */
import * as action from "../actions/productsActions";
import produce from "immer";
import drafts from "./drafts";
import { ProductsState } from "../types";
import { AnyAction } from "redux";

const initialState = drafts.initializeState({
  products: [],
  sortedProducts: [],
  isSaved: true,
  currentProduct: {}
});

export default (
  state: ProductsState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_PRODUCTS_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_PRODUCTS_SUCCESS:
        return drafts.loadSuccess(draft, "products", payload);

      case action.LOAD_PRODUCTS_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_PRODUCTS_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_PRODUCTS_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_PRODUCTS_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.CREATE_PRODUCT:
        draft.currentProduct = payload;
        break;

      case action.SAVE_CREATED_PRODUCT:
        draft.products.push(payload);
        draft.isSaved = false;
        break;

      case action.SET_CURRENT_PRODUCT:
        draft.currentProduct = state.products[payload - 1];
        break;

      case action.SAVE_EDITED_PRODUCT:
        draft.products[payload.productID - 1] = payload;
        draft.isSaved = false;
        break;

      case action.CLEAR_CURRENT_PRODUCT:
        draft.currentProduct = null;
        break;

      case action.TOGGLE_PRODUCT:
        draft.products[payload - 1].active = !state.products[payload - 1]
          .active;
        draft.isSaved = false;
        break;

      case action.UPDATE_PRODUCT_AMOUNT:
        draft.products[payload.id - 1].amount += payload.amount;
        draft.isSaved = false;
        break;

      case action.RESET_PRODUCTS:
        return drafts.resetReducer(initialState);

      default:
        return state;
    }
  });
