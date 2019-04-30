import * as action from "../actions/inventoryActions"

const initialState = {
  inventory: [],
  isLoading: false,
  loaded: false,
  isSaving: false,
  saved: false,
  error: null
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    case action.LOAD_INVENTORY_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case action.LOAD_INVENTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loaded: true,
        inventory: payload
      }
    case action.LOAD_INVENTORY_FAILURE:
      return {
        ...state,
        inventory: [],
        isLoading: false,
        loaded: false,
        error: payload
      }
    case action.SAVE_INVENTORY_BEGIN:
      return {
        ...state,
        isSaving: true,
        error: null
      }
    case action.SAVE_INVENTORY_SUCCESS:
      return {
        ...state,
        isSaving: false,
        saved: true
      }
    case action.SAVE_INVENTORY_FAILURE:
      return {
        ...state,
        isSaving: false,
        saved: false,
        error: payload
      }
    case action.ADD_PRODUCT_TO_INVENTORY:
      return {
        ...state,
        inventory: [...state.inventory, payload]
      }
    case action.REMOVE_PRODUCT_FROM_INVENTORY:
      let inventoryWithoutProduct = state.inventory.filter(prod => prod.id !== payload)
      return {
        ...state,
        inventory: inventoryWithoutProduct
      }
    case action.CHANGE_PRODUCT_AMOUNT:
      let updatedInventory = state.inventory.map(prod => {
        if(prod.id === payload.id){
          prod.amount = payload.amount
          return prod
        } else {
          return prod
        }
      })
      return {
        ...state,
        inventory: updatedInventory
      }
    default:
      return state
  }
}