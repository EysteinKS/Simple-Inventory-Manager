import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createOrder,
  editOrder,
  clearCurrentOrder
} from "../../redux/actions/ordersActions";
import { sort, newOrder } from "../../constants/util";

import EditOrder from "../../components/inventory/EditModals/EditOrder";
import SectionHeader, {
  Row,
  ColumnSplitter,
  Title,
  Key,
  SortingKey,
  TDirections,
  HeaderButton,
  HeaderTop,
  HeaderButtons
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState, IOrder } from "../../redux/types";
import EditSuppliers from "../Suppliers/Suppliers";
import Order from "./Order";
import { TableWrapper, ListWrapper } from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";

type TEdit = (id: number) => void;

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);
  const [isSuppliersOpen, setSuppliersOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(
    orders.orders as IOrder[]
  );
  useEffect(() => {
    setList(orders.orders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.orders]);

  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const handleNewOrder = () => {
    dispatch(createOrder(newOrder(orders.currentID + 1)));
    setOrderOpen(true);
  }

  return (
    <TableWrapper>
      <SectionHeader>
        <HeaderTop>
          <Title>Bestillinger</Title>
          <HeaderButtons>
            <HeaderButton onClick={handleNewOrder} data-tip data-for={"orders_header_add"}>
              <Icons.Add/>
            </HeaderButton>
            <Tooltip handle={"orders_header_add"}>
              Ny bestilling
            </Tooltip>
            <HeaderButton onClick={() => setSuppliersOpen(true)} data-tip data-for={"orders_header_suppliers"}>
              <Icons.Store/><Icons.List/>
            </HeaderButton>
            <Tooltip handle={"orders_header_suppliers"}>
              Leverandører
            </Tooltip>
          </HeaderButtons>
        </HeaderTop>
        <Row grid="10% 15% 15% 10%">
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("orderID", dir))}
            data-tip data-for={"orders_header_id"}
          >
            #
          </SortingKey>
          <Tooltip handle={"orders_header_id"}>
            ID
          </Tooltip>

          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.bySupplier(suppliers.suppliers, dir))
            }
            data-tip data-for={"orders_header_supplier"}
          >
            <Icons.Store />
          </SortingKey>
          <Tooltip handle={"orders_header_supplier"}>
            Leverandør
          </Tooltip>

          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
            data-tip data-for={"orders_header_ordered"}
          >
            <Icons.AccessTime />
          </SortingKey>
          <Tooltip handle={"orders_header_ordered"}>
            Dato bestilt
          </Tooltip>

          <Key data-tip data-for={"orders_header_amount"}>
            <Icons.ShoppingCart />
          </Key>
          <Tooltip handle={"orders_header_amount"}>
            Antall produkter
          </Tooltip>
        </Row>
      </SectionHeader>
      <ListWrapper>
        {sortedList &&
          sortedList.map((order, index) => (
            <Order 
              order={order}
              key={"order_" + order.orderID}
              edit={id => {
                dispatch(editOrder(id));
                setOrderOpen(true);
              }}
              index={index}
            />
        ))}
      </ListWrapper>
      {isOrderOpen && (
        <EditOrder
          isOpen={isOrderOpen}
          close={() => {
            setOrderOpen(false);
            dispatch(clearCurrentOrder());
          }}
        />
      )}
      {isSuppliersOpen && (
        <EditSuppliers
          isOpen={isSuppliersOpen}
          close={() => setSuppliersOpen(false)}
        />
      )}
    </TableWrapper>
  );
}