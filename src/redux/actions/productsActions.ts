import {
  getSectionFromFirestore,
  setSectionToFirestore
} from "../middleware/thunks";
import { IProduct } from "../types";

const thisSection = "products";

//LOADING

export const LOAD_PRODUCTS_BEGIN = "LOAD_PRODUCTS_BEGIN";
export const loadProductsBegin = () => ({
  type: LOAD_PRODUCTS_BEGIN
});

export const LOAD_PRODUCTS_SUCCESS = "LOAD_PRODUCTS_SUCCESS";
type TLoadProductsSuccess = {
  products: IProduct[];
  currentID: number;
};
export const loadProductsSuccess = ({
  products,
  currentID
}: TLoadProductsSuccess) => ({
  type: LOAD_PRODUCTS_SUCCESS,
  payload: { products, currentID }
});

export const LOAD_PRODUCTS_FAILURE = "LOAD_PRODUCTS_FAILURE";
export const loadProductsFailure = (error: string) => ({
  type: LOAD_PRODUCTS_FAILURE,
  payload: error
});

export const loadProducts = () =>
  getSectionFromFirestore(
    thisSection,
    loadProductsBegin,
    loadProductsSuccess,
    loadProductsFailure,
    data => {
      return {
        products: data.products,
        currentID: data.currentID
      };
    }
  );

//SAVING

export const SAVE_PRODUCTS_BEGIN = "SAVE_PRODUCTS_BEGIN";
export const saveProductsBegin = () => ({
  type: SAVE_PRODUCTS_BEGIN
});

export const SAVE_PRODUCTS_SUCCESS = "SAVE_PRODUCTS_SUCCESS";
export const saveProductsSuccess = () => ({
  type: SAVE_PRODUCTS_SUCCESS
});

export const SAVE_PRODUCTS_FAILURE = "SAVE_PRODUCTS_FAILURE";
export const saveProductsFailure = (error: string) => ({
  type: SAVE_PRODUCTS_FAILURE,
  payload: error
});

export const saveProducts = (date: Date) =>
  setSectionToFirestore(
    date,
    thisSection,
    saveProductsBegin,
    saveProductsSuccess,
    saveProductsFailure,
    state => {
      return {
        products: state.products.products,
        currentID: state.products.currentID
      };
    }
  );

//PRODUCT HANDLING

export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const createProduct = (initializedProduct: IProduct) => ({
  type: CREATE_PRODUCT,
  payload: initializedProduct
});

export const SAVE_CREATED_PRODUCT = "SAVE_CREATED_PRODUCT";
export const saveCreatedProduct = (created: IProduct) => ({
  type: SAVE_CREATED_PRODUCT,
  payload: created
});

export const SET_CURRENT_PRODUCT = "SET_CURRENT_PRODUCT";
export const setCurrentProduct = (id: number) => ({
  type: SET_CURRENT_PRODUCT,
  payload: id
});

export const SAVE_EDITED_PRODUCT = "SAVE_EDITED_PRODUCT";
export const saveEditedProduct = (edited: IProduct) => ({
  type: SAVE_EDITED_PRODUCT,
  payload: edited
});

export const CLEAR_CURRENT_PRODUCT = "CLEAR_CURRENT_PRODUCT";
export const clearCurrentProduct = () => ({
  type: CLEAR_CURRENT_PRODUCT
});

export const TOGGLE_PRODUCT = "TOGGLE_PRODUCT";
export const toggleProduct = (id: number) => ({
  type: TOGGLE_PRODUCT,
  payload: id
});

export const UPDATE_PRODUCT_AMOUNT = "UPDATE_PRODUCT_AMOUNT";
export const updateProductAmount = (id: number, amount: number) => ({
  type: UPDATE_PRODUCT_AMOUNT,
  payload: { id, amount }
});

export const RESET_PRODUCTS = "RESET_PRODUCTS";
export const resetProducts = () => ({
  type: RESET_PRODUCTS
});
