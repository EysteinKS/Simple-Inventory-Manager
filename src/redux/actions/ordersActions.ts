import { updateProductAmount } from "./productsActions";
import {
  getSectionFromFirestore,
  setSectionToFirestore,
  convertTimestampsToDates
} from "../middleware/thunks";
import { IOrderedProduct, IOrder } from "../types";
import { IThunkAction } from "../middleware/types";
import { addChange } from "./reportsActions";
import { addNotification, notifications } from "./notificationActions";

const thisSection = "orders";

//LOADING

export const LOAD_ORDERS_BEGIN = "LOAD_ORDERS_BEGIN";
export const loadOrdersBegin = () => ({
  type: LOAD_ORDERS_BEGIN
});

export const LOAD_ORDERS_SUCCESS = "LOAD_ORDERS_SUCCESS";
export const loadOrdersSuccess = ({
  orders,
  history,
  currentID
}: {
  orders: IOrder[];
  history: IOrder[];
  currentID: number;
}) => ({
  type: LOAD_ORDERS_SUCCESS,
  payload: { orders, history, currentID }
});

export const LOAD_ORDERS_FAILURE = "LOAD_ORDERS_FAILURE";
export const loadOrdersFailure = (error: string) => ({
  type: LOAD_ORDERS_FAILURE,
  payload: error
});

export const loadOrders = () =>
  getSectionFromFirestore(
    thisSection,
    loadOrdersBegin,
    loadOrdersSuccess,
    loadOrdersFailure,
    data => {
      let orders = convertTimestampsToDates(data.orders, [
        "dateOrdered",
        "dateReceived"
      ]);
      let history = convertTimestampsToDates(data.history, [
        "dateOrdered",
        "dateReceived"
      ]);
      return {
        orders: orders,
        history: history,
        currentID: data.currentID
      };
    }
  );

//SAVING

export const SAVE_ORDERS_BEGIN = "SAVE_ORDERS_BEGIN";
export const saveOrdersBegin = () => ({
  type: SAVE_ORDERS_BEGIN
});

export const SAVE_ORDERS_SUCCESS = "SAVE_ORDERS_SUCCESS";
export const saveOrdersSuccess = () => ({
  type: SAVE_ORDERS_SUCCESS
});

export const SAVE_ORDERS_FAILURE = "SAVE_ORDERS_FAILURE";
export const saveOrdersFailure = (error: string) => ({
  type: SAVE_ORDERS_FAILURE,
  payload: error
});

export const saveOrders = (date: Date) =>
  setSectionToFirestore(
    date,
    thisSection,
    saveOrdersBegin,
    saveOrdersSuccess,
    saveOrdersFailure,
    state => {
      let s = state.orders;
      let orders = convertTimestampsToDates(s.orders, [
        "dateOrdered",
        "dateReceived"
      ]);
      let history = convertTimestampsToDates(s.history, [
        "dateOrdered",
        "dateReceived"
      ]);
      return {
        orders: orders,
        history: history,
        currentID: s.currentID
      };
    }
  );

//ORDER HANDLING

export const CREATE_ORDER = "CREATE_ORDER";
export const createOrder = (initializedOrder: IOrder) => ({
  type: CREATE_ORDER,
  payload: initializedOrder
});

export const SAVE_CREATED_ORDER = "SAVE_CREATED_ORDER";
export const saveCreatedOrder = (created: IOrder) => ({
  type: SAVE_CREATED_ORDER,
  payload: created
});

export const EDIT_ORDER = "EDIT_ORDER";
export const editOrder = (id: number) => ({
  type: EDIT_ORDER,
  payload: id
});

export const SAVE_EDITED_ORDER = "SAVE_EDITED_ORDER";
export const saveEditedOrder = (order: IOrder) => ({
  type: SAVE_EDITED_ORDER,
  payload: order
});

export const CLEAR_CURRENT_ORDER = "CLEAR_CURRENT_ORDER";
export const clearCurrentOrder = () => ({
  type: CLEAR_CURRENT_ORDER
});

export const RECEIVED_ORDER = "RECEIVED_ORDER";
export const receivedOrder = (id: number, date: Date) => ({
  type: RECEIVED_ORDER,
  payload: { id, date }
});

export const didReceiveOrder = (
  id: number,
  ordered: IOrderedProduct[],
  date: Date
): IThunkAction => {
  return async dispatch => {
    ordered.forEach(product => {
      dispatch(updateProductAmount(product.productID, product.amount));
    });
    dispatch(receivedOrder(id, date));
  };
};

export const FILTER_ORDERS = "FILTER_ORDERS";

export const SORT_ORDERS = "SORT_ORDERS";
export const sortOrders = (func: Function) => ({
  type: SORT_ORDERS,
  payload: func
});

export const TOGGLE_ORDER = "TOGGLE_ORDER";

export const DELETE_ORDER = "DELETE_ORDER";
export const deleteOrder = (id: number) => ({
  type: DELETE_ORDER,
  payload: id
});

export const RESET_ORDERS = "RESET_ORDERS";
export const resetOrders = () => ({
  type: RESET_ORDERS
});

export const UNDO_ORDER = "UNDO_ORDER";
export const undoOrder = (id: number) => ({
  type: UNDO_ORDER,
  payload: id
});

export const didUndoOrder = (
  id: number,
  ordered: IOrderedProduct[]
): IThunkAction => {
  return async dispatch => {
    dispatch(undoOrder(id));
    ordered.forEach(product => {
      dispatch(
        updateProductAmount(product.productID, -Math.abs(product.amount))
      );
    });
    dispatch(
      addChange({
        type: "UNDO_ORDER",
        id,
        section: "orders"
      })
    );
    dispatch(addNotification(notifications.addedChange()));
  };
};
