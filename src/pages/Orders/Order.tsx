import React, { useState } from "react"
import { IOrder, RootState, IOrderedProduct } from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import Icons from "../../components/util/Icons";
import Buttons from "../../components/util/Buttons";
import { addChange } from "../../redux/actions/reportsActions";
import { deleteOrder, didReceiveOrder } from "../../redux/actions/ordersActions";
import ProductName from "../../components/inventory/ProductName";
import { ExpandedTableItem } from "../../styles/table";
import { OrderTime, OrderContent, OrderWrapper } from "./styles";

type TOrdered = { productID: number, amount: number }

type TOrder = {
  order: IOrder
  edit: (id: number) => void
  index: number
}

const Order: React.FC<TOrder> = ({ order, edit, index }) => {
  const { orderID, supplierID, dateOrdered, dateReceived, ordered } = order;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers);

  let orderDate
  if(typeof dateOrdered === "string"){
    let stringToDate = new Date(dateOrdered)
    orderDate = stringToDate.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  } else if (dateOrdered) {
    orderDate = dateOrdered.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }
  
  let receivedDate = null
  if(dateReceived && typeof dateReceived === "object"){
    receivedDate = dateReceived.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  let totalOrdered = ordered.reduce((acc: number, cur: TOrdered) => acc + cur.amount, 0);

  return (
    <>
      <OrderWrapper index={index}>
        <p>{orderID}</p>
        <p>{suppliers[supplierID - 1].name}</p>
        <p>{orderDate}</p>
        <p>{totalOrdered}</p>
        <div />
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button onClick={() => edit(orderID)}>
          <Icons.Edit />
        </button>
        <Buttons.Confirm
          message="Vil du slette denne bestillingen?"
          onConfirm={() => {
            dispatch(addChange({
              type: "DELETE_ORDER",
              id: orderID,
              section: "orders"
            }))
            dispatch(deleteOrder(orderID))
          }}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft mottak av bestilling"
          onConfirm={() => {
            dispatch(addChange({
              type: "RECEIVED_ORDER",
              id: orderID,
              section: "orders"
            }))
            dispatch(didReceiveOrder(orderID, ordered))
          }}
        >
          >
        </Buttons.Confirm>
      </OrderWrapper>
      {expanded && <ExpandedTableItem expanded={expanded}>
        <OrderTime>
          <p>Bestilt: {orderDate}</p>
          <p>Mottatt: {receivedDate || "Nei"}</p>
        </OrderTime>
        <OrderContent>
          {ordered.map((prod: IOrderedProduct, i: number) => (
            <Product product={prod} key={orderID + "product" + i} />
          ))}
        </OrderContent>
      </ExpandedTableItem>}
    </>
  );
};

type TProduct = {
  product: IOrderedProduct
}

const Product = ({ product }: TProduct) => {
  return (
    <div>
      <span>
        {product.amount}x <ProductName id={product.productID} />
      </span>
    </div>
  );
};

export default Order