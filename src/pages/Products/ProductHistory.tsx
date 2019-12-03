import React from "react";
import HistoryModal from "../../components/inventory/HistoryModals";
import { IProduct, RootState } from "../../redux/types";
import { useSelector } from "react-redux";
import { ItemWrapper } from "../../components/inventory/HistoryModals/styles";
import useNames from "../../hooks/useNames";

interface ProductHistoryProps {
  product: IProduct;
  close: () => void;
}

const ProductHistory: React.FC<ProductHistoryProps> = ({ product, close }) => {
  const ordersByProduct = useSelector((state: RootState) => {
    let allOrders = state.orders.history.filter(order => !order.isDeleted);
    let ordersWithProduct = allOrders.filter(order => {
      let orderedProductsByID = order.ordered.map(
        orderedProduct => orderedProduct.productID
      );
      return orderedProductsByID.includes(product.productID);
    });
    return ordersWithProduct;
  });
  const memoizedOrders = React.useMemo(
    () =>
      ordersByProduct.map(order => {
        return {
          type: "order",
          id: order.orderID,
          target: order.supplierID,
          date: Date.parse(order.dateReceived as string),
          amount:
            order.ordered[
              order.ordered.findIndex(p => p.productID === product.productID)
            ].amount
        };
      }),
    [ordersByProduct, product.productID]
  );

  const salesByProduct = useSelector((state: RootState) => {
    let allSales = state.sales.history.filter(sale => !sale.isDeleted);
    let salesWithProduct = allSales.filter(sale => {
      let orderedProductsByID = sale.ordered.map(
        orderedProduct => orderedProduct.productID
      );
      return orderedProductsByID.includes(product.productID);
    });
    return salesWithProduct;
  });
  const memoizedSales = React.useMemo(
    () =>
      salesByProduct.map(sale => {
        return {
          type: "sale",
          id: sale.saleID,
          target: sale.customerID,
          date: Date.parse(sale.dateSent as string),
          amount:
            sale.ordered[
              sale.ordered.findIndex(p => p.productID === product.productID)
            ].amount
        };
      }),
    [salesByProduct, product.productID]
  );

  const loansByProduct = useSelector((state: RootState) => {
    let allLoans = state.loans.history.filter(loan => !loan.isDeleted);
    let loansWithProduct = allLoans.filter(loan => {
      let orderedProductsByID = loan.ordered.map(
        orderedProduct => orderedProduct.productID
      );
      return orderedProductsByID.includes(product.productID);
    });
    return loansWithProduct;
  });
  const memoizedLoans = React.useMemo(
    () =>
      loansByProduct.map(loan => {
        return {
          type: "loan",
          id: loan.loanID,
          target: loan.customerID,
          date: Date.parse(loan.dateReceived as string),
          amount:
            loan.ordered[
              loan.ordered.findIndex(p => p.productID === product.productID)
            ].amount
        };
      }),
    [loansByProduct, product.productID]
  );

  const combinedHistory = React.useMemo(() => {
    let combined = memoizedOrders.concat(memoizedSales).concat(memoizedLoans);
    let sorted = combined.sort((a, b) => a.date - b.date);
    return sorted;
  }, [memoizedOrders, memoizedSales, memoizedLoans]);

  const columns = "2fr 4fr 3fr 2fr";

  return (
    <HistoryModal
      isOpen={Boolean(product)}
      close={close}
      label="Product History"
      name={product.name}
      columns={columns}
      columnNames={["Type/ID", "Kunde/Leverandør", "Tidspunkt", "Antall"]}
    >
      {combinedHistory.map(order => (
        <HistoryItem
          key={`product_${product.productID}_${order.type}_${order.id}`}
          item={order}
          columns={columns}
        />
      ))}
    </HistoryModal>
  );
};

interface IHistoryItem {
  item: {
    type: string;
    id: number;
    target: number;
    date: number;
    amount: number;
  };
  columns: string;
}

const HistoryItem: React.FC<IHistoryItem> = ({ item, columns }) => {
  const targetSection = () => {
    switch (item.type) {
      case "order":
        return "suppliers";
      default:
        return "customers";
    }
  };

  const type = () => {
    switch (item.type) {
      case "order":
        return "Bestilling";
      case "sale":
        return "Salg";
      default:
        return "Utlån";
    }
  };

  const name = useNames(targetSection(), item.target);
  const dateOpts = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  };
  const date = new Date(item.date).toLocaleString("default", dateOpts);

  return (
    <ItemWrapper columns={columns}>
      <p>
        {type()} #{item.id}
      </p>
      <p>{name}</p>
      <p>{date}</p>
      <p>{item.amount}</p>
    </ItemWrapper>
  );
};

export default ProductHistory;
