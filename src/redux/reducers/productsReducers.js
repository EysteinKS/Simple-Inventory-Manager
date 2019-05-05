import * as action from "../actions/productsActions"

const initialState = {
  products: [],
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
        products: payload
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
    case action.ENABLE_PRODUCT:
      let enabled = state.products.map(product => {
        if(product.productID === payload){
          product.active = true
        }
        return product
      })
      return {
        ...state,
        products: enabled
      }
    case action.DISABLE_PRODUCT:
      return {
        ...state
      }
    case action.SORT_PRODUCTS:
      const sortByName = (a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()

        let compare = 0;
        if(nameA > nameB){
          compare = 1
        } else if (nameA < nameB) {
          compare = -1
        }
        return (
          (payload.direction === "desc") ? (compare * -1) : compare
        )
      }
      let sorted
      if(payload.sorting === "name"){
        sorted = [...state.products].sort(sortByName)
      }

      return {
        ...state,
        products: sorted 
      }
    default:
      return state
  }
}