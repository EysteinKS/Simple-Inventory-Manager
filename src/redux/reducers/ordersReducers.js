import * as action from "../actions/ordersActions"

const initialState = {
  orders: [],
  isLoading: false,
  isLoaded: false,
  isSaving: false,
  saved: false,
  error: null
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    case action.LOAD_ORDERS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case action.LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        orders: payload
      }
    case action.LOAD_ORDERS_FAILURE:
      return {
        ...state,
        orders: [],
        isLoading: false,
        isLoaded: false,
        error: payload
      }
    case action.SAVE_ORDERS_BEGIN:
      return {
        ...state,
        isSaving: true,
        error: null
      }
    case action.SAVE_ORDERS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        saved: true
      }
    case action.SAVE_ORDERS_FAILURE:
      return {
        ...state,
        isSaving: false,
        saved: false,
        error: payload
      }
    default:
      return state
  }
}