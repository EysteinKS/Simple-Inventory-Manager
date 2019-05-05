import { getProducts } from "../../constants/api"

//LOADING

export const LOAD_PRODUCTS_BEGIN = 'LOAD_PRODUCTS_BEGIN'
export const loadProductsBegin = () => ({
  type: LOAD_PRODUCTS_BEGIN,
})

export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS'
export const loadProductsSuccess = (products = []) => ({
  type: LOAD_PRODUCTS_SUCCESS,
  payload: products
})

export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE'
export const loadProductsFailure = (error) => ({
  type: LOAD_PRODUCTS_FAILURE,
  payload: error
})

export const loadProducts = () => {
  return dispatch => {
    dispatch(loadProductsBegin())
    getProducts.then(res => {
      console.log("Loaded products successfully: ", res)
      dispatch(loadProductsSuccess(res))
    }).catch(err => loadProductsFailure(err))
  }
}

//SAVING

export const SAVE_PRODUCTS_BEGIN = 'SAVE_PRODUCTS_BEGIN'
export const saveProductsBegin = () => ({
  type: SAVE_PRODUCTS_BEGIN,
})

export const SAVE_PRODUCTS_SUCCESS = 'SAVE_PRODUCTS_SUCCESS'
export const saveProductsSuccess = () => ({
  type: SAVE_PRODUCTS_SUCCESS,
})

export const SAVE_PRODUCTS_FAILURE = 'SAVE_PRODUCTS_FAILURE'
export const saveInventoryFailure = (error) => ({
  type: SAVE_PRODUCTS_FAILURE,
  payload: error
})

//PRODUCT HANDLING

export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const createProduct = (product) => ({
  type: CREATE_PRODUCT,
  payload: product
})

export const EDIT_PRODUCT = 'EDIT_PRODUCT'
export const editProduct = (id, settings) => ({
  type: EDIT_PRODUCT,
  payload: { id, settings }
})


export const TOGGLE_PRODUCT = 'TOGGLE_PRODUCT'
export const toggleProduct = id => ({
  type: TOGGLE_PRODUCT,
  payload: id
})

//PRODUCT VISIBILITY


export const SORT_PRODUCTS = "SORT_PRODUCTS"
export const sortProducts = (func) => ({
  type: SORT_PRODUCTS,
  payload: func
})

export const FILTER_PRODUCTS = 'FILTER_PRODUCTS'
export const filterProducts = (func) => ({
  type: FILTER_PRODUCTS,
  payload: func
})
