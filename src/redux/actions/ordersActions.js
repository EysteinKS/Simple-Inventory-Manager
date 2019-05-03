import { getOrders } from "../../constants/api"

//LOADING

export const LOAD_ORDERS_BEGIN = 'LOAD_ORDERS_BEGIN'
export const loadOrdersBegin = () => ({
  type: LOAD_ORDERS_BEGIN,
})

export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const loadOrdersSuccess = (orders = []) => ({
  type: LOAD_ORDERS_SUCCESS,
  payload: orders
})

export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE'
export const loadOrdersFailure = (error) => ({
  type: LOAD_ORDERS_FAILURE,
  payload: error
})

export const loadOrders = () => {
  return dispatch => {
    dispatch(loadOrdersBegin())
    getOrders.then(res => {
      console.log("Loaded orders successfully: ", res)
      dispatch(loadOrdersSuccess(res))
    }).catch(err => loadOrdersFailure(err))
  }
}

//SAVING

export const SAVE_ORDERS_BEGIN = 'SAVE_ORDERS_BEGIN'
export const saveOrdersBegin = () => ({
  type: SAVE_ORDERS_BEGIN,
})

export const SAVE_ORDERS_SUCCESS = 'SAVE_ORDERS_SUCCESS'
export const saveOrdersSuccess = () => ({
  type: SAVE_ORDERS_SUCCESS,
})

export const SAVE_ORDERS_FAILURE = 'SAVE_ORDERS_FAILURE'
export const saveOrdersFailure = (error) => ({
  type: SAVE_ORDERS_FAILURE,
  payload: { error }
})

//ORDER HANDLING

export const ADD_ORDER = 'ADD_ORDER'
export const addOrder = (order) => ({
  type: ADD_ORDER,
  payload: order
})

export const DELETE_ORDER = "DELETE_ORDER"
export const deleteOrder = (id) => ({
  type: DELETE_ORDER,
  payload: id
})

export const CHANGE_ORDER = 'CHANGE_ORDER'
export const changeOrder = (id, order) => ({
  type: CHANGE_ORDER,
  payload: { id, order }
})

export const RECEIVED_ORDER = 'RECEIVED_ORDER'
export const receivedOrder = (id) => ({
  type: RECEIVED_ORDER,
  payload: id
})
