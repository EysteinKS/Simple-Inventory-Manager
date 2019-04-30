import { getInventory } from "../../constants/mock"

//LOADING

export const LOAD_INVENTORY_BEGIN = 'LOAD_INVENTORY_BEGIN'
export const loadInventoryBegin = () => ({
  type: LOAD_INVENTORY_BEGIN,
})

export const LOAD_INVENTORY_SUCCESS = 'LOAD_INVENTORY_SUCCESS'
export const loadInventorySuccess = (inventory = []) => ({
  type: LOAD_INVENTORY_SUCCESS,
  payload: inventory
})

export const LOAD_INVENTORY_FAILURE = 'LOAD_INVENTORY_FAILURE'
export const loadInventoryFailure = (error) => ({
  type: LOAD_INVENTORY_FAILURE,
  payload: error
})

export const loadInventory = () => {
  return dispatch => {
    dispatch(loadInventoryBegin())
    getInventory()
      .then(res => {
        dispatch(loadInventorySuccess(res))
    })
      .catch(err => loadInventoryFailure(err))
  }
}

//SAVING

export const SAVE_INVENTORY_BEGIN = 'SAVE_INVENTORY_BEGIN'
export const saveInventoryBegin = () => ({
  type: SAVE_INVENTORY_BEGIN,
})

export const SAVE_INVENTORY_SUCCESS = 'SAVE_INVENTORY_SUCCESS'
export const saveInventorySuccess = () => ({
  type: SAVE_INVENTORY_SUCCESS,
})

export const SAVE_INVENTORY_FAILURE = 'SAVE_INVENTORY_FAILURE'
export const saveInventoryFailure = (error) => ({
  type: SAVE_INVENTORY_FAILURE,
  payload: { error }
})

//PRODUCT HANDLING

export const ADD_PRODUCT_TO_INVENTORY = 'ADD_PRODUCT_TO_INVENTORY'
export const addProductToInventory = (product) => ({
  type: ADD_PRODUCT_TO_INVENTORY,
  payload: { product }
})

export const REMOVE_PRODUCT_FROM_INVENTORY = "REMOVE_PRODUCT_FROM_INVENTORY"
export const removeProductFromInventory = (id) => ({
  type: REMOVE_PRODUCT_FROM_INVENTORY,
  payload: id
})

export const CHANGE_PRODUCT_AMOUNT = 'CHANGE_PRODUCT_AMOUNT'
export const changeProductAmount = (id, amount) => ({
  type: CHANGE_PRODUCT_AMOUNT,
  payload: {
    id, 
    amount
  }
})
