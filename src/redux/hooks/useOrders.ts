import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions/ordersActions";
import { RootState, IOrder, IOrderedProduct, IChangeValue } from "../types";
import { useMemo } from "react";
import { addChange } from "../actions/reportsActions";
import { addNotification, notifications } from "../actions/notificationActions";

export const newOrder = (id: number): IOrder => {
  let date = new Date();
  return {
    orderID: id,
    supplierID: 1,
    dateOrdered: date,
    dateReceived: null,
    ordered: [],
    isNew: true
  };
};

const useOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.orders.orders);
  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  ) as IOrder;
  const currentID = useSelector((state: RootState) => state.orders.currentID);
  const memoizedID = useMemo(() => currentID, [currentID]);

  const createNewOrder = () => {
    dispatch(actions.createOrder(newOrder(memoizedID + 1)));
  };

  const editOrder = (id: number) => {
    dispatch(actions.editOrder(id));
  };

  const clearCurrentOrder = () => {
    dispatch(actions.clearCurrentOrder());
  };

  const saveCreatedOrder = (order: IOrder) => {
    dispatch(
      addChange({
        type: "NEW_ORDER",
        id: order.orderID,
        section: "orders"
      })
    );
    dispatch(actions.saveCreatedOrder(order));
    dispatch(addNotification(notifications.addedChange()));
  };

  const saveEditedOrder = (order: IOrder, changed: IChangeValue[]) => {
    dispatch(
      addChange({
        type: "EDIT_ORDER_INFO",
        id: order.orderID,
        section: "orders",
        changed: changed
      })
    );
    dispatch(actions.saveEditedOrder(order));
    dispatch(addNotification(notifications.addedChange()));
  };

  const deleteOrder = (id: number) => {
    dispatch(
      addChange({
        type: "DELETE_ORDER",
        id,
        section: "orders"
      })
    );
    dispatch(actions.deleteOrder(id));
    dispatch(addNotification(notifications.addedChange()));
  };

  const receivedOrder = (
    id: number,
    ordered: IOrderedProduct[],
    date: Date
  ) => {
    dispatch(
      addChange({
        type: "RECEIVED_ORDER",
        id,
        section: "orders"
      })
    );
    dispatch(actions.didReceiveOrder(id, ordered, date));
    dispatch(addNotification(notifications.addedChange()));
  };

  return {
    orders,
    currentOrder,
    createNewOrder,
    editOrder,
    clearCurrentOrder,
    saveCreatedOrder,
    saveEditedOrder,
    deleteOrder,
    receivedOrder
  };
};

export default useOrders;
