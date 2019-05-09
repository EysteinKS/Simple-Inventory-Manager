import React, { useState } from "react";
import { useSelector } from "react-redux";
//import { sortProducts } from "../../redux/actions/productsActions"
import "./Orders.css";
import ProductName from "../ProductName";

import SectionHeader, { Row, Title, Key, KeyButton } from "../SectionHeader";

export default () => {
  const list = useSelector(state => state.orders.orders);

  const LeftButton = () => (
    <button
      onClick={() => {
        //dispatch(createProduct(newProduct(products.products.length + 1)));
        //setProductOpen(true);
      }}
    >
      Legg til
    </button>
  );
  const RightButton = () => {
    return (
      <button
        onClick={() => {
          //setCategoriesOpen(true);
        }}
      >
        Leverandører
      </button>
    );
  };

  return (
    <div>
      <SectionHeader>
        <Row grid="20% 60% 20%">
          <LeftButton />
          <Title>Bestillinger</Title>
          <RightButton />
        </Row>
        <Row grid="10% 30% 30% 30%">
          <Key name="#"/>
          <Key name="Navn"/>
          <Key name="Leverandør"/>
        </Row>
      </SectionHeader>
      <List list={list} />
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
    orderid,
    supplier,
    title,
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

  return (
    <div className="order">
      <div className="order-grid">
        <p>{orderid}</p>
        <p>{title}</p>
        <p>{supplier}</p>
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button>X</button>
        <button>></button>
      </div>
      <div className={detailStyle}>
        <div className="order-time">
          <p>Bestilt: {dateOrdered}</p>
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
