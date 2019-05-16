import React, { useState, useCallback, Fragment, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  createOrder,
  editOrder,
  saveCreatedOrder,
  savedEditedOrder,
  clearCurrentOrder,
  saveOrders,
  loadOrders,
  sortOrders,
  //filterOrders,
  receivedOrder
} from "../../redux/actions/ordersActions"
import { saveSuppliers } from "../../redux/actions/suppliersActions"
import {
  sort,
  filterByOrdered,
  newOrder
} from "../../constants/util"
import "./Orders.css";

import ProductName from "../ProductName";
import SectionHeader, { Row, Title, Key, SortingKey } from "../SectionHeader";
import CloudStatus from "../CloudStatus"
import Icons from "../Icons"
import {useGate} from "../../constants/hooks"

export default () => {
  const list = useSelector(state => state.orders.orders);
  const dispatch = useDispatch()
  const orders = useSelector(state => state.orders)
  const ordersList = orders.sortedOrders
  const suppliers = useSelector(state => state.orders)
  const [isOrderOpen, setOrderOpen] = useState(false)
  const [isSuppliersOpen, setSuppliersOpen] = useState(false)

  const [isFiltered, setFiltered] = useState(true);
  const [filterInput, setFilterInput] = useState(false)
  const filter = useCallback(() => {
    setFiltered(!isFiltered);
    //dispatch(filterOrders(filterByOrdered(isFiltered, filterInput)));
  }, [isFiltered, filterInput, dispatch]);

  const buttonStyle = {
    height: "75%",
    width: "75%",
    borderRadius: "15px"
  }

  const NewOrderButton = () => (
    <button style={buttonStyle} onClick={() => {
        dispatch(createOrder(newOrder(orders.orders.length + 1)));
        setOrderOpen(true);
      }}>
      Legg til
    </button>
  );
  const SuppliersButton = () => {
    return (
      <button style={buttonStyle} onClick={() => {
          setSuppliersOpen(true);
        }}>
        Leverandører
      </button>
    );
  };
  
  const allIsSaving = useMemo(() => [orders.isSaving, suppliers.isSaving], [orders.isSaving, suppliers.isSaving])
  const savingGate = useGate(allIsSaving, "OR", "ordersIsSaving")
  const allIsSaved = useMemo(() => [orders.isSaved, suppliers.isSaved], [orders.isSaved, suppliers.isSaved])
  const savedGate = useGate(allIsSaved, "AND", "ordersIsSaved")
  const allError = useMemo(() => [orders.savingError, suppliers.savingError], [orders.savingError, suppliers.savingError])
  const errorGate = useGate(allError, "OR", "ordersLoadingError")

  return (
    <div>
      <SectionHeader>
        <Row grid="15% 15% 40% 15% 15%">
          <NewOrderButton />
          <SuppliersButton />
          <Title>Bestillinger</Title>
          <CloudStatus 
            save={() => {
              dispatch(saveOrders(orders.orders))
              dispatch(saveSuppliers(suppliers.suppliers))
            }}
            isSaving={savingGate}
            isSaved={savedGate}
            error={errorGate}
          />
        </Row>
        <Row grid="15% 15% 15% 15%">
          <SortingKey
            sorting={dir => sort.by("orderID", dir)}
            target={sortOrders}
            >#</SortingKey>
          <SortingKey
            sorting={dir => sort.byName(dir)}
            target={sortOrders}
          ><Icons.Business/></SortingKey>
          <SortingKey><Icons.LocalShipping/></SortingKey>
          <SortingKey><Icons.ShoppingCart/></SortingKey>
        </Row>
      </SectionHeader>
      {(!Array.isArray(ordersList) || !ordersList.length)
        ? null
        : <List list={ordersList} />}
    </div>
  );
};

const List = ({ list }) => {
  if (list) {
    return (
      <div className="order-list">
        {list.map((order, index) => (
          <Order order={order} key={index} />
        ))}
      </div>
    );
  } else {
    return <div>No orders found!</div>;
  }
};

const Order = ({ order }) => {
  const {
    orderID,
    supplier,
    dateOrdered,
    dateReceived,
    ordered
  } = order;
  const [expanded, setExpanded] = useState(false);

  let detailStyle;
  if (expanded) {
    detailStyle = "order-details";
  } else {
    detailStyle = "order-details collapsed";
  }

  let orderDate = dateOrdered.toLocaleDateString("default", {year: "numeric", month: "short", day: "numeric"})
  let totalOrdered = ordered.reduce((acc, cur) => acc + cur.amount, 0)
  console.log(ordered)
  console.log({...totalOrdered})

  return (
    <div className="order">
      <div className="order-grid">
        <p>{orderID}</p>
        <p>{supplier}</p>
        <p>{orderDate}</p>
        <p>{totalOrdered}</p>
        <div/>
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button>X</button>
        <button>></button>
      </div>
      <div className={detailStyle}>
        <div className="order-time">
          <p>Bestilt: {orderDate}</p>
          <p>Mottatt: {dateReceived || "Nei"}</p>
        </div>
        <div className="order-content">
          {ordered.map((prod, i) => (
            <Product product={prod} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Product = ({ product }) => {
  return (
    <div>
      <span>
        {product.amount}x <ProductName id={product.productID} />
      </span>
    </div>
  );
};
