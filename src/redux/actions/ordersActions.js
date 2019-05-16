import { getOrders } from "../../constants/api"
import { firestore } from "../../firebase/firebase";

//LOADING

export const LOAD_ORDERS_BEGIN = 'LOAD_ORDERS_BEGIN'
export const loadOrdersBegin = () => ({
  type: LOAD_ORDERS_BEGIN,
})

export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const loadOrdersSuccess = (orders) => ({
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

export const loadOrdersNew = () => {
  return dispatch => {
    dispatch(loadOrdersBegin())
    firestore.doc("Barcontrol/Orders")
      .then(res => {
        let orders = res.data().orders
        console.log("Loaded orders successfully")
        dispatch(loadOrdersSuccess(orders))
      })
      .catch(err => dispatch(loadOrdersFailure(err)))
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

export const saveOrders = (orders) => {
  return dispatch => {
    dispatch(saveOrdersBegin())
    firestore.doc("Barcontrol/Orders").set({
      orders: orders
    }, {merge: true})
      .then(() => {
        dispatch(saveOrdersSuccess())
      })
      .catch(err => dispatch(saveOrdersFailure(err)))
  }
}

//ORDER HANDLING

export const CREATE_ORDER = 'CREATE_ORDER'
export const createOrder = (initializedOrder) => ({
  type: CREATE_ORDER,
  payload: initializedOrder
})

export const SAVE_CREATED_ORDER = 'SAVE_CREATED_ORDER'
export const saveCreatedOrder = (created) => ({
  type: SAVE_CREATED_ORDER,
  payload: created
})

export const EDIT_ORDER = 'EDIT_ORDER'
export const editORder = (id) => ({
  type: EDIT_ORDER,
  payload: id
})

export const SAVE_EDITED_ORDER = 'SAVE_EDITED_ORDER'
export const saveEditedOrder = (edited) => ({
  type: SAVE_EDITED_ORDER,
  payload: edited
})

export const CLEAR_CURRENT_ORDER = 'CLEAR_CURRENT_ORDER'
export const clearCurrentOrder = () => ({
  type: CLEAR_CURRENT_ORDER
})

export const RECEIVED_ORDER = 'RECEIVED_ORDER'
export const receivedOrder = (id) => ({
  type: RECEIVED_ORDER,
  payload: id
})

export const FILTER_ORDERS = 'FILTER_ORDERS'

export const SORT_ORDERS = 'SORT_ORDERS'
export const sortOrders = (func) => ({
  type: SORT_ORDERS,
  payload: func
})

export const TOGGLE_ORDER = "TOGGLE_ORDER"