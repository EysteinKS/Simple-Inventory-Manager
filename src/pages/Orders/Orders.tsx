import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { sort } from "../../constants/util";

import EditOrder from "../../components/inventory/EditModals/EditOrder";
import {
  Title,
  Key,
  SortingKey,
  TDirections,
  HeaderButton,
  HeaderButtons
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState, IOrder } from "../../redux/types";
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
import useOrders from "../../redux/hooks/useOrders";

export default function Orders() {
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isOrderOpen, setOrderOpen] = useState(false);
  const { secondary } = useAuthLocation();

  const { orders, createNewOrder, editOrder, clearCurrentOrder } = useOrders();

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(orders as IOrder[]);
  useEffect(() => {
    setList(orders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

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
    createNewOrder();
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
            <Icons.Suppliers />
            <Tooltip handle={"orders_header_supplier"}>Leverandør</Tooltip>
          </SortingKey>

          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
              data-tip
              data-for={"orders_header_ordered"}
            >
              <Icons.Calendar />
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
                  editOrder(id);
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
            clearCurrentOrder();
          }}
        />
      )}
    </TableWrapper>
  );
}
