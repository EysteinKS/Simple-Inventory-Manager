import { secondaryFirestore as firestore } from "../../firebase/firebase"

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
  return (dispatch, getState) => {
    const state = getState()    
    dispatch(loadProductsBegin())
    firestore.doc(`${state.auth.currentLocation}/Products`).get()
      .then(res => {
        let data = res.data()
        let products = data.products
        console.log("Loaded products successfully")
        dispatch(loadProductsSuccess(products))
      })
      .catch(err => loadProductsFailure(err))
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
export const saveProductsFailure = (error) => ({
  type: SAVE_PRODUCTS_FAILURE,
  payload: error
})

export const saveProducts = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveProductsBegin())
    firestore.doc(`${state.auth.currentLocation}/Products`).set({
      products: state.products.products
    }, {merge: true})
      .then(() => {
        dispatch(saveProductsSuccess())
      })
      .catch(err => dispatch(saveProductsFailure(err)))
  }
}

//PRODUCT HANDLING

export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const createProduct = (initializedProduct) => ({
  type: CREATE_PRODUCT,
  payload: initializedProduct
})

export const SAVE_CREATED_PRODUCT = 'SAVE_CREATED_PRODUCT'
export const saveCreatedProduct = (created) => ({
  type: SAVE_CREATED_PRODUCT,
  payload: created
})

export const EDIT_PRODUCT = 'EDIT_PRODUCT'
export const editProduct = (id) => ({
  type: EDIT_PRODUCT,
  payload: id
})


export const SAVE_EDITED_PRODUCT = 'SAVE_EDITED_PRODUCT'
export const saveEditedProduct = (edited) => ({
  type: SAVE_EDITED_PRODUCT,
  payload: edited
})

export const CLEAR_CURRENT_PRODUCT = 'CLEAR_CURRENT_PRODUCT'
export const clearCurrentProduct = () => ({
  type: CLEAR_CURRENT_PRODUCT,
})


export const TOGGLE_PRODUCT = 'TOGGLE_PRODUCT'
export const toggleProduct = id => ({
  type: TOGGLE_PRODUCT,
  payload: id
})

export const UPDATE_PRODUCT_AMOUNT = 'UPDATE_PRODUCT_AMOUNT'
export const updateProductAmount = (id, amount) => ({
  type: UPDATE_PRODUCT_AMOUNT,
  payload: {id, amount}
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

export const RESET_PRODUCTS = 'RESET_PRODUCTS'
export const resetProducts = () => ({
  type: RESET_PRODUCTS
})
