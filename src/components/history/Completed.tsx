import React from "react";
import { useSelector } from "react-redux";
import { RootState, IOrderedProduct } from "../../redux/types";
import styled from "styled-components";
import Table, {
  ITableColumn,
  TableBody,
  TableHeader,
  TableRow
} from "../util/SectionTable";
import { selectProductNames } from "../../redux/selectors/productSelectors";
import { shouldLog } from "../../constants/util";

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
};

const Completed = () => {
  const productNames = useSelector(selectProductNames);
  const orderHistory = useSelector((state: RootState) => state.orders.history);
  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );
  const saleHistory = useSelector((state: RootState) => state.sales.history);
  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  const loanHistory = useSelector((state: RootState) => state.loans.history)

  const ordersColumns = React.useMemo(() => {
    return [
      { name: "ID", width: "10%" },
      { name: "SUPPLIER", width: "30%" },
      { name: "ORDERED", width: "30%" },
      { name: "RECEIVED", width: "30%" },
      { name: "AMOUNT", width: "10%" }
    ];
  }, []);

  const ordersContent = React.useMemo(() => {
    shouldLog("Calculating content in orders history")
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
      let received = new Date(order.dateReceived as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let amount = order.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [order.orderID, supplierName, ordered, received, amount];
      return (
        <ExpandableRow key={"order_history_" + order.orderID} columns={columns}>
          <OrderedProducts
            id={"order_" + order.orderID}
            ordered={order.ordered}
            names={productNames}
          />
        </ExpandableRow>
      );
    });
  }, [orderHistory, suppliers, productNames]);

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
    shouldLog("Calculating content in sales history")
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
      let sent = new Date(sale.dateSent as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let amount = sale.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [sale.saleID, customerName, ordered, sent, amount];
      return (
        <ExpandableRow key={"order_history_" + sale.saleID} columns={columns}>
          <OrderedProducts
            id={"sale_" + sale.saleID}
            ordered={sale.ordered}
            names={productNames}
          />
        </ExpandableRow>
      );
    });
  }, [saleHistory, customers, productNames]);

  const loansColumns = React.useMemo(() => {
    return [
      { name: "ID", width: "10%" },
      { name: "CUSTOMER", width: "20%" },
      { name: "ORDERED", width: "20%" },
      { name: "SENT", width: "20%" },
      { name: "RECEIVED", width: "20%" },
      { name: "AMOUNT", width: "10%" }
    ];
  }, []);

  const loansContent = React.useMemo(() => {
    shouldLog("Calculating content in orders history")
    let sorted = [...loanHistory].sort((a, b) => {
      return a.loanID - b.loanID;
    });
    return sorted.map(loan => {
      let customerName =
        customers[customers.findIndex(i => i.customerID === loan.customerID)]
          .name;
      let ordered = new Date(loan.dateOrdered as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let sent = new Date(loan.dateSent as string).toLocaleString(
        "default",
        localeStringOpts
      )
      let received = new Date(loan.dateReceived as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let amount = loan.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [loan.loanID, customerName, ordered, sent, received, amount];
      return (
        <ExpandableRow key={"order_history_" + loan.loanID} columns={columns}>
          <OrderedProducts
            id={"order_" + loan.loanID}
            ordered={loan.ordered}
            names={productNames}
            columns={6}
          />
        </ExpandableRow>
      );
    });
  }, [loanHistory, customers, productNames]);

  return (
    <div>
      {/* ORDERS */}
      {(orderHistory.length > 0) &&
      <HistoryTable name="Orders" columns={ordersColumns}>
        {ordersContent}
      </HistoryTable>}
      {/* SALES */}
      {(saleHistory.length > 0) &&
      <HistoryTable name="Sales" columns={salesColumns}>
        {salesContent}
      </HistoryTable>}
      {/* LOANS */}
      {(loanHistory.length > 0) &&
      <HistoryTable name="Loans" columns={loansColumns}>
        {loansContent}
      </HistoryTable>}
    </div>
  );
};

const TableButton = styled.button`
  width: 100%;
  display: grid;
  place-content: center;
  height: 7vh;
  background-color: lightgray;
  margin-top: 10px;
`;

interface IExpandableRow {
  columns: any[];
}

export const ExpandableRow: React.FC<IExpandableRow> = ({ columns, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  const rowStyle = React.useMemo(() => {
    if (isOpen) {
      return {
        backgroundColor: "#eee",
        border: "2px solid #ccc"
      };
    } else {
      return {};
    }
  }, [isOpen]);

  return (
    <>
      <TableRow
        style={rowStyle}
        columns={columns}
        onClick={() => setOpen(!isOpen)}
      />
      {isOpen && children}
    </>
  );
};

interface IOrderedProducts {
  id: string;
  names: { [key: number]: string };
  ordered: IOrderedProduct[];
  columns?: number
}

const OrderedCell = styled.td`
  text-align: center;
`;

const OrderedProducts: React.FC<IOrderedProducts> = ({
  id,
  names,
  ordered,
  columns = 5
}) => {
  const orderedList = React.useMemo(() => {
    let sorted = ordered.sort((a, b) => a.productID - b.productID);
    return sorted.map((o, i) => {
      return (
        <tr key={`${id}_ordered_${i}`}>
          <OrderedCell>{o.productID}</OrderedCell>
          <OrderedCell>{names[o.productID]}</OrderedCell>
          <OrderedCell>{o.amount}</OrderedCell>
        </tr>
      );
    });
  }, [names, ordered, id]);

  return (
    <tr>
      <td colSpan={columns} style={{ borderTop: "2px solid #ccc" }}>
        <table
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px 25%",
            backgroundColor: "#f6f6f6",
            border: "2px solid #ccc",
            borderTop: "none"
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "20%" }}>ID</th>
              <th style={{ width: "60%" }}>NAME</th>
              <th style={{ width: "20%" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>{orderedList}</tbody>
        </table>
      </td>
    </tr>
  );
};

interface IHistoryTable {
  name: string;
  columns: ITableColumn[];
}

const HistoryTable: React.FC<IHistoryTable> = ({ name, columns, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <TableButton onClick={() => setOpen(!isOpen)}>
        <h2 style={{ textAlign: "left", paddingLeft: "10px" }}>{name}</h2>
      </TableButton>
      {isOpen && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            border: "2px solid lightgray"
          }}
        >
          <Table
            style={{
              borderCollapse: "collapse",
              width: "100%"
            }}
          >
            <TableHeader columns={columns} />
            <TableBody>{children}</TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default Completed;
