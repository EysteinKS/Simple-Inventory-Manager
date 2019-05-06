import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sortProducts } from "../../redux/actions/productsActions"
import "./Orders.css";
import ProductName from "../ProductName"

export default () => {
  const list = useSelector(state => state.orders.orders);

  return (
    <div>
      <h3 style={{display: "flex", justifyContent: "center"}}>Bestillinger</h3>
      <OrdersHeader />
      <List list={list} />
    </div>
  );
};

const OrdersHeader = () => {
  return (
    <div className="orders-header">
      <p>#</p>
      <p>Navn</p>
      <p>Leverandør</p>
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
  const { orderid, supplier, title, dateOrdered, dateReceived, ordered } = order;
  const [ expanded, setExpanded ] = useState(false)

  let detailStyle;
  if(expanded){
    detailStyle = "order-details"
  } else {
    detailStyle = "order-details collapsed"
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
            <Product product={prod} key={i}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const Product = ({ product }) => {
  return(
    <div>
      <span>{product.amount}x <ProductName id={product.productID}/></span>
    </div>
  )
}