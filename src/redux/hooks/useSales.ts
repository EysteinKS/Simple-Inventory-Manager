import { useDispatch, useSelector } from "react-redux";
import { RootState, ISale, IOrderedProduct } from "../types";
import { useMemo } from "react";
import * as actions from "../actions/salesActions";
import { addChange } from "../actions/reportsActions";
import { addNotification, notifications } from "../actions/notificationActions";

export const newSale = (id: number): ISale => {
  let date = new Date();
  return {
    saleID: id,
    customerID: 1,
    dateOrdered: date,
    dateSent: null,
    ordered: [],
    isNew: true,
    isReady: false
  };
};

const useSales = () => {
  const dispatch = useDispatch();

  const sales = useSelector((state: RootState) => state.sales.sales);
  const currentID = useSelector((state: RootState) => state.sales.currentID);
  const memoizedID = useMemo(() => currentID, [currentID]);

  const createNewSale = () => {
    dispatch(actions.createSale(newSale(memoizedID + 1)));
  };

  const editSale = (id: number) => {
    dispatch(actions.editSale(id));
  };

  const clearCurrentSale = () => {
    dispatch(actions.clearCurrentSale());
  };

  const toggleReady = (id: number) => {
    dispatch(actions.toggleSaleReady(id));
    dispatch(addNotification(notifications.addedChange()));
  };

  const deleteSale = (id: number) => {
    dispatch(
      addChange({
        type: "DELETE_SALE",
        id,
        section: "sales"
      })
    );
    dispatch(actions.deleteSale(id));
    dispatch(addNotification(notifications.addedChange()));
  };

  const sendSale = (id: number, ordered: IOrderedProduct[], date: Date) => {
    dispatch(
      addChange({
        type: "SENT_SALE",
        id,
        section: "sales"
      })
    );
    dispatch(actions.didSendSale(id, ordered, date));
    dispatch(addNotification(notifications.addedChange()));
  };

  return {
    sales,
    createNewSale,
    editSale,
    clearCurrentSale,
    toggleReady,
    deleteSale,
    sendSale
  };
};

export default useSales;
