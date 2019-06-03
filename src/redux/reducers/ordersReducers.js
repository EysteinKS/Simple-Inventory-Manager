/* eslint-disable default-case */
import * as action from "../actions/ordersActions"
import produce from "immer";
import drafts from "./drafts";

const initialState = drafts.initializeState({
  orders: [],
  sortedOrders: [],
  currentOrder: {}
})

export default (state = initialState, {type, payload}) => 
produce(state, draft => {
  switch (type) {
    case action.LOAD_ORDERS_BEGIN:
      return drafts.loadBegin(draft);
    case action.LOAD_ORDERS_SUCCESS:
      drafts.loadSuccess(
        draft,
        ["orders", "sortedOrders"],
        payload.orders
      );
      draft.currentID = payload.currentID
      draft.history = payload.history
      break
    case action.LOAD_ORDERS_FAILURE:
      return drafts.loadFailure(draft, payload);
    case action.SAVE_ORDERS_BEGIN:
      return drafts.saveBegin(draft);
    case action.SAVE_ORDERS_SUCCESS:
      return drafts.saveSuccess(draft);
    case action.SAVE_ORDERS_FAILURE:
      return drafts.saveFailure(draft, payload);
    case action.CREATE_ORDER:
      draft.currentOrder = payload
      draft.currentOrder.orderID = state.currentID + 1
      break;
    case action.SAVE_CREATED_ORDER:
      draft.orders.push(payload);
      draft.sortedOrders.push(payload);
      draft.currentOrder = {};
      draft.isSaved = false;
      draft.currentID = payload.orderID
      break;
    case action.EDIT_ORDER:
      draft.currentOrder = state.orders.find(order => order.orderID === payload)
      break;
    case action.SAVE_EDITED_ORDER:
      let newArray = state.orders.map(order => {
        if(order.orderID === payload.orderID){
          return payload
        } else {
          return order
        }
      })
      draft.orders = newArray
      draft.sortedOrders = newArray
      draft.currentOrder = {};
      draft.isSaved = false;
      break;
    case action.CLEAR_CURRENT_ORDER:
      draft.currentOrder = {};
      break;
    case action.TOGGLE_ORDER:
      draft.orders[payload - 1].active = !state.orders[payload - 1]
        .active;
      draft.sortedOrders = draft.orders;
      draft.isSaved = false;
      break;
    case action.SORT_ORDERS:
      draft.sortedOrders.sort(payload);
      break;
    case action.FILTER_ORDERS:
      draft.sortedOrders = draft.orders.filter(payload);
      break;
    case action.RECEIVED_ORDER:
      let orderIndex
      let received = state.orders.find((order, index) => {
        if(order.orderID === payload){
          orderIndex = index
        }
        return (order.orderID === payload)
      })
      received.dateReceived = new Date()
      draft.history.push(received)
      draft.orders.splice(orderIndex, 1)
      draft.sortedOrders = draft.orders
      draft.isSaved = false
      break;
    case action.DELETE_ORDER:
      let deletedArray = state.orders.filter(order => order.orderID !== payload)
      draft.orders = deletedArray
      draft.sortedOrders = deletedArray
      draft.isSaved = false;
      break;
    case action.RESET_ORDERS:
      return drafts.resetReducer(draft, initialState)
    default:
      break;
  }
});
