import React from "react";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";

const HoverInfo: React.FC<{ handle: string }> = ({ handle, children }) => {
  return (
    <ReactTooltip id={handle} place="bottom" type="dark" effect="solid">
      {children}
    </ReactTooltip>
  );
};

export const Tooltip: React.FC<{
  handle: string;
  place?: "top" | "bottom" | "left" | "right";
}> = ({ handle, children, place = "bottom" }) => {
  const showTooltips = useSelector(
    (state: RootState) => state.auth.user.settings.showTooltips
  );
  if (showTooltips) {
    return (
      <ReactTooltip id={handle} place={place} type="dark" effect="solid">
        <p>{children}</p>
      </ReactTooltip>
    );
  } else {
    return null;
  }
};

interface IProps {
  productID: number;
  handle: string;
}

type InfoReturn = {
  id: number;
  name: string;
  amount: number;
};

export const OrdersInfo: React.FC<IProps> = ({ productID, handle }) => {
  const ordersWithProduct = useSelector((state: RootState) => {
    const allOrders = state.orders.orders;
    const filteredOrders = allOrders.filter(order => {
      let doesContainProduct = false;
      order.ordered.forEach(order => {
        if (doesContainProduct === false) {
          if (order.productID === productID) {
            doesContainProduct = true;
          }
        }
      });
      return doesContainProduct;
    });
    return filteredOrders;
  });

  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );

  const orderedArray = React.useMemo(() => {
    return ordersWithProduct.map(order => {
      const productOrder =
        order.ordered[
          order.ordered.findIndex(line => line.productID === productID)
        ];
      const supplierName =
        suppliers[
          suppliers.findIndex(supp => supp.supplierID === order.supplierID)
        ].name;
      return {
        id: order.orderID,
        name: supplierName,
        amount: productOrder.amount
      };
    });
  }, [productID, ordersWithProduct, suppliers]);

  return (
    <HoverInfo handle={handle}>
      {orderedArray.map(order => (
        <InfoRow
          key={"product_orders_" + order.id}
          name={order.name}
          amount={order.amount}
        />
      ))}
    </HoverInfo>
  );
};

export const SalesInfo: React.FC<IProps> = ({ productID, handle }) => {
  const salesWithProduct = useSelector((state: RootState) => {
    const allOrders = state.sales.sales;
    const filteredOrders = allOrders.filter(order => {
      let doesContainProduct = false;
      order.ordered.forEach(order => {
        if (doesContainProduct === false) {
          if (order.productID === productID) {
            doesContainProduct = true;
          }
        }
      });
      return doesContainProduct;
    });
    return filteredOrders;
  });

  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );

  const orderedArray = React.useMemo(() => {
    return salesWithProduct.map(sale => {
      const productOrder =
        sale.ordered[
          sale.ordered.findIndex(line => line.productID === productID)
        ];
      const customerName =
        customers[
          customers.findIndex(cust => cust.customerID === sale.customerID)
        ].name;
      return {
        id: sale.saleID,
        name: customerName,
        amount: productOrder.amount
      };
    });
  }, [productID, salesWithProduct, customers]);

  return (
    <HoverInfo handle={handle}>
      {orderedArray.map(order => (
        <InfoRow
          key={"product_orders_" + order.id}
          name={order.name}
          amount={order.amount}
        />
      ))}
    </HoverInfo>
  );
};

export const LoansInfo: React.FC<IProps> = ({ productID, handle }) => {
  const loansWithProduct = useSelector((state: RootState) => {
    const allLoans = state.loans.loans;
    const filteredOrders = allLoans.filter(loan => {
      let doesContainProduct = false;
      loan.ordered.forEach(order => {
        if (doesContainProduct === false) {
          if (order.productID === productID) {
            doesContainProduct = true;
          }
        }
      });
      return doesContainProduct;
    });
    return filteredOrders;
  });

  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );

  const orderedArrays = React.useMemo(() => {
    let ordered: InfoReturn[] = [];
    let sent: InfoReturn[] = [];
    loansWithProduct.forEach(loan => {
      const productOrder =
        loan.ordered[
          loan.ordered.findIndex(line => line.productID === productID)
        ];
      const customerName =
        customers[
          customers.findIndex(cust => cust.customerID === loan.customerID)
        ].name;
      let ret = {
        id: loan.loanID,
        name: customerName,
        amount: productOrder.amount
      };
      if (loan.dateSent == null) {
        ordered.push(ret);
      } else {
        sent.push(ret);
      }
    });
    return [ordered, sent];
  }, [productID, loansWithProduct, customers]);

  return (
    <HoverInfo handle={handle}>
      {orderedArrays[0].length > 0 && (
        <p style={{ textAlign: "center" }}>Bestilt</p>
      )}
      {orderedArrays[0].length > 0 &&
        orderedArrays[0].map(order => (
          <InfoRow
            key={"product_ordered_loans_" + order.id}
            name={order.name}
            amount={order.amount}
          />
        ))}
      {orderedArrays[1].length > 0 && (
        <p style={{ textAlign: "center" }}>Sendt</p>
      )}
      {orderedArrays[1].length > 0 &&
        orderedArrays[1].map(order => (
          <InfoRow
            key={"product_sent_loans_" + order.id}
            name={order.name}
            amount={order.amount}
          />
        ))}
    </HoverInfo>
  );
};

interface InfoRowProps {
  name: string;
  amount: number;
}

const InfoRow: React.FC<InfoRowProps> = ({ name, amount }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        placeItems: "center"
      }}
    >
      <p>{amount}x</p>
      <p>-></p>
      <p>{name}</p>
    </div>
  );
};

export default HoverInfo;
