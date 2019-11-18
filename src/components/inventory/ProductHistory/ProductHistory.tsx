import React from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { RootState, IProduct } from "../../../redux/types";
import {
  ItemWrapper,
  HistoryContent,
  ListHeader,
  ListWrapper,
  HistoryTitle
} from "./styles";
import useNames from "../../../hooks/useNames";
ReactModal.setAppElement("#root");

interface IProps {
  isOpen: boolean;
  close: () => void;
}

const ProductHistory: React.FC<IProps> = ({ isOpen, close }) => {
  const product = useSelector(
    (state: RootState) => state.products.currentProduct
  ) as IProduct;

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
    let sorted = combined.sort((a, b) => b.date - a.date);
    return sorted;
  }, [memoizedOrders, memoizedSales, memoizedLoans]);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Product History"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        content: {
          top: "10vh",
          left: "5vw",
          right: "5vw",
          bottom: "none",
          display: "grid",
          gridTemplateRows: "1fr 14fr",
          padding: "0",
          border: "none",
          backgroundColor: "#bdbdbd"
        }
      }}
    >
      <HistoryTitle>Historikk - {product.name}</HistoryTitle>
      <HistoryList>
        {combinedHistory.map(item => (
          <HistoryItem
            key={"prod_" + product.productID + "_" + item.type + "_" + item.id}
            item={item}
          />
        ))}
      </HistoryList>
    </ReactModal>
  );
};

const HistoryList: React.FC = ({ children }) => {
  return (
    <HistoryContent>
      <ListHeader>
        <p>Type/ID</p>
        <p>Kunde/Leverandør</p>
        <p>Tidspunkt</p>
        <p>Antall</p>
      </ListHeader>
      <ListWrapper>{children}</ListWrapper>
    </HistoryContent>
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
}

const HistoryItem: React.FC<IHistoryItem> = ({ item }) => {
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
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  const date = new Date(item.date).toLocaleString("default", dateOpts);

  return (
    <ItemWrapper>
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
