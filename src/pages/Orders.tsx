import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createOrder,
  editOrder,
  clearCurrentOrder,
  didReceiveOrder,
  deleteOrder
} from "../redux/actions/ordersActions";
import { sort, newOrder, isArrayEmpty } from "../constants/util";
import "./Orders.css";

import EditOrder from "../components/inventory/EditOrder";
import ProductName from "../components/inventory/ProductName";
import SectionHeader, {
  Row,
  RowSplitter,
  ColumnSplitter,
  Title,
  Key,
  SortingKey,
  TDirections
} from "../components/util/SectionHeader";
import CloudStatus from "../components/util/CloudStatus";
import Icons from "../components/util/Icons";
import Buttons from "../components/util/Buttons";

import useSortableList from "../hooks/useSortableList";
import produce from "immer";
import { RootState, IOrder, IOrderedProduct } from "../redux/types";
import { addChange } from "../redux/actions/reportsActions";

type TOrdered = { productID: number, amount: number }
type TEdit = (id: number) => void

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);

  //SORTING
  const [ sorting, setSorting ] = useState([null, null, null] as any[]);
  const { sortedList, setList, setSortingFuncs } = useSortableList(orders.orders as IOrder[])
  useEffect(() => {
    setList(orders.orders);
    setSortingFuncs(sorting);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.orders]);
  const sortList = (dir: TDirections, index: number, func: Function) => {
    if (dir !== null) {
      let newSorting = produce(sorting, draft => {
        draft[index] = func;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    } else {
      let newSorting = produce(sorting, draft => {
        draft[index] = null;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    }
  };

  const buttonStyle = {
    height: "75%",
    width: "75%",
    borderRadius: "15px"
  };

  const NewOrderButton = () => (
    <button
      style={buttonStyle}
      onClick={() => {
        dispatch(createOrder(newOrder(orders.currentID + 1)));
        setOrderOpen(true);
      }}
    >
      Legg til
    </button>
  );
  const SuppliersButton = () => {
    return (
      <button
        style={buttonStyle}
        onClick={() => {
          //setSuppliersOpen(true);
        }}
      >
        Leverandører
      </button>
    );
  };

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewOrderButton />
          <SuppliersButton />
          <Title>Bestillinger</Title>
          <br />
          <CloudStatus/>
        </Row>
        <RowSplitter/>
        <Row grid="14% 1% 14% 1% 14% 1% 15%">
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("orderID", dir))}
          >
            #
          </SortingKey>
          <ColumnSplitter/>
          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.bySupplier(suppliers.suppliers, dir))
            }
          >
            <Icons.Business />
          </SortingKey>
          <ColumnSplitter/>
          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
          >
            <Icons.AccessTime />
          </SortingKey>
          <ColumnSplitter/>
          <Key>
            <Icons.ShoppingCart />
          </Key>
        </Row>
      </SectionHeader>
      {!isArrayEmpty(sortedList) && (
        <List
          list={sortedList as IOrder[]}
          edit={id => {
            dispatch(editOrder(id));
            setOrderOpen(true);
          }}
        />
      )}
      {isOrderOpen && <EditOrder
        isOpen={isOrderOpen}
        close={() => {
          setOrderOpen(false);
          dispatch(clearCurrentOrder());
        }}
      />}
    </div>
  );
}

type TList = {
  list: IOrder[],
  edit: TEdit
}

const List = ({ list, edit }: TList) => {
  if (list) {
    return (
      <div>
        {list.map((order, index) => (
          <Order order={order} key={"order_" + order.orderID} edit={edit} />
        ))}
      </div>
    );
  } else {
    return <div>No orders found!</div>;
  }
};

type TOrder = {
  order: IOrder,
  edit: TEdit
}

const Order = ({ order, edit }: TOrder) => {
  const { orderID, supplierID, dateOrdered, dateReceived, ordered } = order;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers);

  let detailStyle;
  if (expanded) {
    detailStyle = "order-details";
  } else {
    detailStyle = "order-details collapsed";
  }

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
    <div className="order">
      <div className="order-grid">
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
      </div>
      <div className={detailStyle}>
        <div className="order-time">
          <p>Bestilt: {orderDate}</p>
          <p>Mottatt: {receivedDate || "Nei"}</p>
        </div>
        <div className="order-content">
          {ordered.map((prod: IOrderedProduct, i: number) => (
            <Product product={prod} key={orderID + "product" + i} />
          ))}
        </div>
      </div>
    </div>
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
