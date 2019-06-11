import { secondaryFirestore as firestore } from "../../firebase/firebase";
import { updateProductAmount, saveProducts } from "./productsActions"

//LOADING

export const LOAD_ORDERS_BEGIN = 'LOAD_ORDERS_BEGIN'
export const loadOrdersBegin = () => ({
  type: LOAD_ORDERS_BEGIN,
})

export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const loadOrdersSuccess = (orders, history, currentID) => ({
  type: LOAD_ORDERS_SUCCESS,
  payload: {orders, history, currentID}
})

export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE'
export const loadOrdersFailure = (error) => ({
  type: LOAD_ORDERS_FAILURE,
  payload: error
})

export const loadOrders = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(loadOrdersBegin())
    firestore.doc(`${state.auth.currentLocation}/Orders`).get()
      .then(res => {
        let data = res.data()
        let orders
        if(data.orders && Array.isArray(data.orders)){
          orders = data.orders.map(order => {
            //Firestore returns date objects as {seconds, nanoseconds}
            order.dateOrdered = new Date(order.dateOrdered.seconds * 1000)
            return order
          })
        }
        console.log("Loaded orders successfully")
        dispatch(loadOrdersSuccess(orders, data.history, data.currentID))
      })
      .catch(err => dispatch(loadOrdersFailure(err.message)))
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

export const saveOrders = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveOrdersBegin())
    firestore.doc(`${state.auth.currentLocation}/Orders`).set({
      orders: state.orders.orders,
      history: state.orders.history,
      currentID: state.orders.currentID
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
export const editOrder = (id) => ({
  type: EDIT_ORDER,
  payload: id
})

export const SAVE_EDITED_ORDER = 'SAVE_EDITED_ORDER'
export const saveEditedOrder = (order) => ({
  type: SAVE_EDITED_ORDER,
  payload: order
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

export const didReceiveOrder = (id, ordered) => {
  return (dispatch, getState) => {
    ordered.forEach(product => {
      dispatch(updateProductAmount(product.productID, product.amount))
    })
    dispatch(receivedOrder(id))
    const state = getState()
    dispatch(saveProducts(state.products.products))
    dispatch(saveOrders())
  }
}

export const FILTER_ORDERS = 'FILTER_ORDERS'

export const SORT_ORDERS = 'SORT_ORDERS'
export const sortOrders = (func) => ({
  type: SORT_ORDERS,
  payload: func
})

export const TOGGLE_ORDER = "TOGGLE_ORDER"

export const DELETE_ORDER = 'DELETE_ORDER'
export const deleteOrder = (id) => ({
  type: DELETE_ORDER,
  payload: id
})

export const RESET_ORDERS = 'RESET_ORDERS'
export const resetOrders = () => ({
  type: RESET_ORDERS
})
