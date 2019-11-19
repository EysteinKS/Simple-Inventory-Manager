import React, { useState, useEffect, useMemo } from "react";
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
import {
  TableWrapper,
  ListWrapper,
  TWidth,
  getTableStyle,
  TableHeader,
  TableContent,
  ContentHeader,
  ExtendColumns
} from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

type TEdit = (id: number) => void;

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);
  const [isSuppliersOpen, setSuppliersOpen] = useState(false);
  const { secondary } = useAuthLocation();

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

  const [extended, setExtended] = useState(() => window.innerWidth > 425);
  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["large"];
    if (extended) {
      data.unshift("small");
      data.push("medium");
    }
    data.push("tiny", "tiny");
    return getTableStyle(data, 4);
  }, [extended]);

  const handleNewOrder = () => {
    dispatch(createOrder(newOrder(orders.currentID + 1)));
    setOrderOpen(true);
  };

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>Bestillinger</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewOrder}
            data-tip
            data-for={"orders_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"orders_header_add"}>Ny bestilling</Tooltip>
          </HeaderButton>
          <HeaderButton
            onClick={() => setSuppliersOpen(true)}
            data-tip
            data-for={"orders_header_suppliers"}
          >
            <Icons.Store />
            <Icons.List />
            <Tooltip handle={"orders_header_suppliers"}>Leverandører</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 0, sort.by("orderID", dir))}
              data-tip
              data-for={"orders_header_id"}
            >
              #<Tooltip handle={"orders_header_id"}>ID</Tooltip>
            </SortingKey>
          )}

          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.bySupplier(suppliers.suppliers, dir))
            }
            data-tip
            data-for={"orders_header_supplier"}
          >
            <Icons.Store />
            <Tooltip handle={"orders_header_supplier"}>Leverandør</Tooltip>
          </SortingKey>

          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
              data-tip
              data-for={"orders_header_ordered"}
            >
              <Icons.AccessTime />
              <Tooltip handle={"orders_header_ordered"}>Dato bestilt</Tooltip>
            </SortingKey>
          )}

          <Key data-tip data-for={"orders_header_amount"}>
            <Icons.ShoppingCart />
            <Tooltip handle={"orders_header_amount"}>Antall produkter</Tooltip>
          </Key>

          <ExtendColumns extended={extended} setExtended={setExtended} />
          <div />
        </ContentHeader>
        <ListWrapper>
          {sortedList &&
            sortedList.map(order => (
              <Order
                order={order}
                extended={extended}
                columns={tableStyles.item}
                key={"order_" + order.orderID}
                edit={id => {
                  dispatch(editOrder(id));
                  setOrderOpen(true);
                }}
              />
            ))}
        </ListWrapper>
      </TableContent>
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
