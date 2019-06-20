import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createOrder,
  editOrder,
  clearCurrentOrder,
  saveOrders,
  didReceiveOrder,
  deleteOrder
} from "../redux/actions/ordersActions";
import { saveSuppliers } from "../redux/actions/suppliersActions";
import { sort, newOrder, isArrayEmpty } from "../constants/util";
import "./Orders.css";

import EditOrder from "../components/EditOrder";
import ProductName from "../components/ProductName";
import SectionHeader, {
  Row,
  RowSplitter,
  Title,
  Key,
  SortingKey
} from "../components/SectionHeader";
import CloudStatus from "../components/CloudStatus";
import Icons from "../components/Icons";
import Buttons from "../components/Buttons";
import useGate from "../hooks/useGate";

import useSortableList from "../hooks/useSortableList";
import produce from "immer";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders);
  const suppliers = useSelector(state => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null, null]);
  const [sortedList, setList, setSortingFuncs] = useSortableList(orders.orders);
  useEffect(() => {
    //console.log("Orders list updated, setting list");
    setList(orders.orders);
    setSortingFuncs(sorting);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.orders]);
  const sortList = (dir, index, func) => {
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

  const allIsSaving = useMemo(() => [orders.isSaving, suppliers.isSaving], [
    orders.isSaving,
    suppliers.isSaving
  ]);
  const savingGate = useGate(allIsSaving, "OR", "ordersIsSaving");
  const allIsSaved = useMemo(() => [orders.isSaved, suppliers.isSaved], [
    orders.isSaved,
    suppliers.isSaved
  ]);
  const savedGate = useGate(allIsSaved, "AND", "ordersIsSaved", true);
  const allError = useMemo(() => [orders.savingError, suppliers.savingError], [
    orders.savingError,
    suppliers.savingError
  ]);
  const errorGate = useGate(allError, "OR", "ordersLoadingError");

  return (
    <div>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewOrderButton />
          <SuppliersButton />
          <Title>Bestillinger</Title>
          <br />
          <CloudStatus
            save={() => {
              //console.log(suppliers);
              dispatch(saveOrders(orders.orders));
              dispatch(saveSuppliers(suppliers.suppliers));
            }}
            isSaving={savingGate}
            isSaved={savedGate}
            error={errorGate}
          />
        </Row>
        <RowSplitter/>
        <Row grid="15% 15% 15% 15%">
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("orderID", dir))}
          >
            #
          </SortingKey>
          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.bySupplier(suppliers.suppliers, dir))
            }
          >
            <Icons.Business />
          </SortingKey>
          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
          >
            <Icons.AccessTime />
          </SortingKey>
          <Key>
            <Icons.ShoppingCart />
          </Key>
        </Row>
      </SectionHeader>
      {isArrayEmpty(sortedList) ? null : (
        <List
          list={sortedList}
          edit={id => {
            dispatch(editOrder(id));
            setOrderOpen(true);
          }}
        />
      )}
      <EditOrder
        isOpen={isOrderOpen}
        close={() => {
          setOrderOpen(false);
          dispatch(clearCurrentOrder());
        }}
      />
    </div>
  );
}

const List = ({ list, edit }) => {
  if (list) {
    return (
      <div className="order-list">
        {list.map((order, index) => (
          <Order order={order} key={index} edit={edit} />
        ))}
      </div>
    );
  } else {
    return <div>No orders found!</div>;
  }
};

const Order = ({ order, edit }) => {
  const { orderID, supplierID, dateOrdered, dateReceived, ordered } = order;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const suppliers = useSelector(state => state.suppliers.suppliers);

  console.log("Order: ", order)

  let detailStyle;
  if (expanded) {
    detailStyle = "order-details";
  } else {
    detailStyle = "order-details collapsed";
  }

  let orderDate = dateOrdered.toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  
  let receivedDate = null
  if(dateReceived){
    receivedDate = dateReceived.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  let totalOrdered = ordered.reduce((acc, cur) => acc + cur.amount, 0);

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
          onConfirm={() => dispatch(deleteOrder(orderID))}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft mottak av bestilling"
          onConfirm={() => dispatch(didReceiveOrder(orderID, ordered))}
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
