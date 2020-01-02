/* eslint-disable default-case */
import * as action from "../actions/ordersActions";
import produce from "immer";
import drafts from "./drafts";
import { OrdersState, IOrder } from "../types";
import { AnyAction } from "redux";
import { insertIntoArray } from "../util";

const initialState = drafts.initializeState({
  orders: [],
  currentOrder: {}
});

export default (
  state: OrdersState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_ORDERS_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_ORDERS_SUCCESS:
        return drafts.loadSuccess(draft, "orders", payload);

      case action.LOAD_ORDERS_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_ORDERS_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_ORDERS_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_ORDERS_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.CREATE_ORDER:
        draft.currentOrder = payload as IOrder;
        draft.currentOrder.orderID = state.currentID + 1;
        break;

      case action.SAVE_CREATED_ORDER:
        draft.orders.push(payload);
        draft.currentOrder = {};
        draft.isSaved = false;
        draft.currentID = payload.orderID;
        break;

      case action.EDIT_ORDER:
        draft.currentOrder = state.orders.find(
          order => order.orderID === payload
        );
        break;

      case action.SAVE_EDITED_ORDER:
        let newArray = state.orders.map(order => {
          if (order.orderID === payload.orderID) {
            return payload;
          } else {
            return order;
          }
        });
        draft.orders = newArray;
        draft.currentOrder = {};
        draft.isSaved = false;
        break;

      case action.CLEAR_CURRENT_ORDER:
        draft.currentOrder = {};
        break;

      case action.TOGGLE_ORDER:
        draft.orders[payload - 1].active = !state.orders[payload - 1].active;
        draft.isSaved = false;
        break;

      case action.RECEIVED_ORDER:
        let orderIndex: number = 0;
        let received: IOrder | any = state.orders.find((order, index) => {
          if (order.orderID === payload.id) {
            orderIndex = index;
          }
          return order.orderID === payload.id;
        });
        received.dateReceived = payload.date;
        draft.history.push(received);
        draft.orders.splice(orderIndex, 1);
        draft.isSaved = false;
        break;

      case action.DELETE_ORDER:
        let orderToDelete = state.orders.find(
          order => order.orderID === payload
        ) as IOrder;
        orderToDelete.isDeleted = true;
        let deleteHistoryIndex: number = 0;
        for (let i = 0; i < draft.history.length; i++) {
          if (
            draft.orders[i].orderID > orderToDelete.orderID ||
            i === draft.history.length - 1
          ) {
            deleteHistoryIndex = i;
            break;
          }
        }
        draft.history.splice(deleteHistoryIndex, 0, orderToDelete);

        let deletedArray = state.orders.filter(
          order => order.orderID !== payload
        );
        draft.orders = deletedArray;
        draft.isSaved = false;
        break;

      case action.RESET_ORDERS:
        return drafts.resetReducer(initialState);

      case action.UNDO_ORDER:
        let historyIndex: number = 0;
        let orderToUndo = state.history.find((order, index) => {
          if (order.orderID === payload) {
            historyIndex = index;
          }
          return order.orderID === payload;
        }) as IOrder;
        draft.history.splice(historyIndex, 1);
        orderToUndo.dateReceived = null;
        orderToUndo.isDeleted = false;

        draft.orders = insertIntoArray(state.orders, orderToUndo, "orderID");
        draft.isSaved = false;
        break;

      default:
        break;
    }
  });
