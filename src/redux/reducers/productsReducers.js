import * as action from "../actions/productsActions"

const initialState = {
  products: [],
  sortedProducts: [],
  isLoading: false,
  loaded: false,
  isSaving: false,
  saved: false,
  error: null
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    case action.LOAD_PRODUCTS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case action.LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loaded: true,
        products: payload,
        sortedProducts: payload
      }
    case action.LOAD_PRODUCTS_FAILURE:
      return {
        ...state,
        products: [],
        isLoading: false,
        loaded: false,
        error: payload
      }
    case action.SAVE_PRODUCTS_BEGIN:
      return {
        ...state,
        isSaving: true,
        error: null
      }
    case action.SAVE_PRODUCTS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        saved: true
      }
    case action.SAVE_PRODUCTS_FAILURE:
      return {
        ...state,
        isSaving: false,
        saved: false,
        error: payload
      }
    case action.CREATE_PRODUCT:
      let newArray = state.products.concat(payload)
      return {
        ...state,
        products: newArray
      }
    case action.EDIT_PRODUCT:
      let edited = state.products.map(product => {
        if(product.productID === payload.id){
          return payload.settings
        } else {
          return product
        }
      })
      return {
        ...state,
        products: edited
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
      console.log(filtered)
      return {
        ...state,
        sortedProducts: filtered
      }
    default:
      return state 
  }
}