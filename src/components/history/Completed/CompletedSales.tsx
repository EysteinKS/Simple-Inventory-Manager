import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectProductNames } from "../../../redux/selectors/productSelectors";
import { RootState } from "../../../redux/types";
import { shouldLog } from "../../../constants/util";
import { ExpandableRow } from "../../util/ExpandableRow";
import OrderedProducts from "./OrderedProducts";
import FunctionsRow from "./FunctionsRow";
import { didUndoSale } from "../../../redux/actions/salesActions";
import HistoryTable from "./HistoryTable";

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
};

const CompletedSales = () => {
  const productNames = useSelector(selectProductNames);
  const saleHistory = useSelector((state: RootState) => state.sales.history);
  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  const dispatch = useDispatch();

  const salesColumns = React.useMemo(() => {
    return [
      { name: "ID", width: "10%" },
      { name: "CUSTOMER", width: "30%" },
      { name: "ORDERED", width: "30%" },
      { name: "SENT", width: "30%" },
      { name: "AMOUNT", width: "10%" }
    ];
  }, []);

  const salesContent = React.useMemo(() => {
    shouldLog("Calculating content in sales history");
    let sorted = [...saleHistory].sort((a, b) => {
      return a.saleID - b.saleID;
    });
    return sorted.map(sale => {
      let customerName =
        customers[customers.findIndex(i => i.customerID === sale.customerID)]
          .name;
      let ordered = new Date(sale.dateOrdered as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let sent;
      if (sale.dateSent) {
        sent = new Date(sale.dateSent as string).toLocaleString(
          "default",
          localeStringOpts
        );
      } else {
        sent = "";
      }
      let amount = sale.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [sale.saleID, customerName, ordered, sent, amount];
      return (
        <ExpandableRow
          key={"order_history_" + sale.saleID}
          columns={columns}
          isDeleted={sale.isDeleted ? sale.isDeleted : false}
        >
          <OrderedProducts
            id={"sale_" + sale.saleID}
            ordered={sale.ordered}
            names={productNames}
            isDeleted={sale.isDeleted ? sale.isDeleted : false}
          >
            <FunctionsRow
              undo={() => dispatch(didUndoSale(sale.saleID, sale.ordered))}
            />
          </OrderedProducts>
        </ExpandableRow>
      );
    });
  }, [saleHistory, customers, productNames, dispatch]);

  if (saleHistory.length > 0) {
    return (
      <HistoryTable name="Sales" columns={salesColumns}>
        {salesContent}
      </HistoryTable>
    );
  } else {
    return null;
  }
};

export default CompletedSales;
