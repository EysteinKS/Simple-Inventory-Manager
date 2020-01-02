import React from "react";
import { shouldLog } from "../../../constants/util";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/types";
import { ExpandableRow } from "../../util/ExpandableRow";
import { selectProductNames } from "../../../redux/selectors/productSelectors";
import OrderedProducts from "./OrderedProducts";
import HistoryTable from "./HistoryTable";
import FunctionsRow from "./FunctionsRow";
import { didUndoOrder } from "../../../redux/actions/ordersActions";

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
};

const CompletedOrders = () => {
  const dispatch = useDispatch();
  const productNames = useSelector(selectProductNames);
  const orderHistory = useSelector((state: RootState) => state.orders.history);
  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );

  const ordersColumns = React.useMemo(() => {
    return [
      { name: "ID", width: "10%" },
      { name: "LEVERANDØR", width: "30%" },
      { name: "BESTILT", width: "30%" },
      { name: "MOTTATT", width: "30%" },
      { name: "ANTALL", width: "10%" }
    ];
  }, []);

  const ordersContent = React.useMemo(() => {
    shouldLog("Calculating content in orders history");
    let sorted = [...orderHistory].sort((a, b) => {
      return a.orderID - b.orderID;
    });
    return sorted.map(order => {
      let supplierName =
        suppliers[suppliers.findIndex(i => i.supplierID === order.supplierID)]
          .name;
      let ordered = new Date(order.dateOrdered as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let received;
      if (order.dateReceived) {
        received = new Date(order.dateReceived as string).toLocaleString(
          "default",
          localeStringOpts
        );
      } else {
        received = "";
      }
      let amount = order.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [order.orderID, supplierName, ordered, received, amount];
      return (
        <ExpandableRow
          key={"order_history_" + order.orderID}
          columns={columns}
          isDeleted={order.isDeleted ? order.isDeleted : false}
        >
          <OrderedProducts
            id={"order_" + order.orderID}
            ordered={order.ordered}
            names={productNames}
            isDeleted={order.isDeleted ? order.isDeleted : false}
          >
            <FunctionsRow
              undo={() => dispatch(didUndoOrder(order.orderID, order.ordered))}
            />
          </OrderedProducts>
        </ExpandableRow>
      );
    });
  }, [orderHistory, suppliers, productNames, dispatch]);

  if (orderHistory.length > 0) {
    return (
      <HistoryTable name="Bestillinger" columns={ordersColumns}>
        {ordersContent}
      </HistoryTable>
    );
  } else {
    return null;
  }
};

export default CompletedOrders;
