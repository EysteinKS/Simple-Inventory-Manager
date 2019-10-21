import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createOrder,
  editOrder,
  clearCurrentOrder
} from "../../redux/actions/ordersActions";
import { sort, newOrder, isArrayEmpty } from "../../constants/util";

import EditOrder from "../../components/inventory/EditModals/EditOrder";
import SectionHeader, {
  Row,
  RowSplitter,
  ColumnSplitter,
  Title,
  Key,
  SortingKey,
  TDirections
} from "../../components/util/SectionHeader";
import CloudStatus from "../../components/util/CloudStatus";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState, IOrder } from "../../redux/types";
import EditSuppliers from "../Suppliers/Suppliers"
import Order from "./Order"
import { TableWrapper } from "../../styles/table";

type TEdit = (id: number) => void

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);
  const [isSuppliersOpen, setSuppliersOpen] = useState(false)

  //SORTING
  const [ sorting, setSorting ] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(orders.orders as IOrder[])
  useEffect(() => {
    setList(orders.orders);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.orders]);

  const sortList = (dir: TDirections, index: number, func: Function) => sortFunc(setSorting)(dir, index, func, sorting)

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
          setSuppliersOpen(true);
        }}
      >
        Leverandører
      </button>
    );
  };

  return (
    <TableWrapper>
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
      {isSuppliersOpen && <EditSuppliers
        isOpen={isSuppliersOpen}
        close={() => setSuppliersOpen(false)}
      />}
    </TableWrapper>
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
          <Order order={order} key={"order_" + order.orderID} edit={edit} index={index}/>
        ))}
      </div>
    );
  } else {
    return <div>No orders found!</div>;
  }
};