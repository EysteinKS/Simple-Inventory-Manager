import * as action from "../actions/productsActions"


const initialState = {
  products: [],
  sortedProducts: [],
  currentProduct: {},
  isLoading: false,
  isLoaded: false,
  loadingError: false,
  isSaving: false,
  isSaved: true,
  savingError: false,
  error: null
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    case action.LOAD_PRODUCTS_BEGIN:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        loadingError: false,
        error: null
      }
    case action.LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        products: payload,
        sortedProducts: payload
      }
    case action.LOAD_PRODUCTS_FAILURE:
      return {
        ...state,
        products: [],
        isLoading: false,
        isLoaded: false,
        error: payload
      }
    case action.SAVE_PRODUCTS_BEGIN:
      return {
        ...state,
        isSaving: true,
        savingError: false,
        error: null
      }
    case action.SAVE_PRODUCTS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        isSaved: true
      }
    case action.SAVE_PRODUCTS_FAILURE:
      return {
        ...state,
        isSaving: false,
        isSaved: false,
        savingError: true,
        error: payload
      }
    case action.CREATE_PRODUCT:
      return {
        ...state,
        currentProduct: payload
      }
    case action.SAVE_CREATED_PRODUCT:
      let withNewProduct = state.products.concat(payload)
      return {
        ...state,
        products: withNewProduct,
        sortedProducts: withNewProduct,
        currentProduct: {},
        isSaved: false
      }
    case action.EDIT_PRODUCT:
      return {
        ...state,
        currentProduct: state.products[payload - 1]
      }
    case action.SAVE_EDITED_PRODUCT:
      let edited = [...state.products]
      edited[payload.productID - 1] = payload
      //console.log(state.products)
      //console.log(edited)
      return {
        ...state,
        products: edited,
        sortedProducts: edited,
        currentProduct: {},
        isSaved: false
      }
    case action.CLEAR_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: {}
      }
    case action.TOGGLE_PRODUCT:
      let enabled = [...state.products]
      let isActive = enabled[payload-1].active
      enabled[payload-1].active = !isActive
      return {
        ...state,
        products: enabled
      }
    case action.SORT_PRODUCTS:
      let sorted = [...state.sortedProducts].sort(payload)
      return {
        ...state,
        sortedProducts: sorted 
      }
    case action.FILTER_PRODUCTS:
      let filtered = [...state.products].filter(payload)
      return {
        ...state,
        sortedProducts: filtered
      }
    default:
      return state 
  }
}