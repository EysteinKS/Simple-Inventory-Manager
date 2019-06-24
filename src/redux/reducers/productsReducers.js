/* eslint-disable default-case */
import * as action from "../actions/productsActions";
import produce from "immer";
import drafts from "./drafts";

const initialState = drafts.initializeState({
  products: [],
  sortedProducts: [],
  isSaved: true,
  currentProduct: {}
})

export default (
  state = initialState,
  { type, payload }
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_PRODUCTS_BEGIN:
        return drafts.loadBegin(draft);
      case action.LOAD_PRODUCTS_SUCCESS:
        return drafts.loadSuccess(
          draft,
          ["products", "sortedProducts"],
          payload
        );
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
        draft.sortedProducts.push(payload);
        draft.currentProduct = {};
        draft.isSaved = false;
        break;
      case action.EDIT_PRODUCT:
        draft.currentProduct = state.products[payload - 1];
        break;
      case action.SAVE_EDITED_PRODUCT:
        draft.products[payload.productID - 1] = payload;
        draft.sortedProducts = draft.products;
        draft.currentProduct = {};
        draft.isSaved = false;
        break;
      case action.CLEAR_CURRENT_PRODUCT:
        draft.currentProduct = {};
        break;
      case action.TOGGLE_PRODUCT:
        draft.products[payload - 1].active = !state.products[payload - 1]
          .active;
        draft.sortedProducts = draft.products;
        draft.isSaved = false;
        break;
      case action.SORT_PRODUCTS:
        draft.sortedProducts.sort(payload);
        break;
      case action.FILTER_PRODUCTS:
        draft.sortedProducts = draft.products.filter(payload);
        break;
      case action.UPDATE_PRODUCT_AMOUNT:
        draft.products[payload.id - 1].amount += payload.amount
        draft.sortedProducts = draft.products
        draft.isSaved = false;
        break;
      case action.RESET_PRODUCTS:
        return drafts.resetReducer(draft, initialState)
      default:
        break;
    }
  });
