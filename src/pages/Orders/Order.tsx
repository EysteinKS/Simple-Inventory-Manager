import React, { useState } from "react";
import { IOrder, RootState } from "../../redux/types";
import { useSelector } from "react-redux";
import Icons from "../../components/util/Icons";
import Buttons from "../../components/util/Buttons";
import {
  ExpandedTableItem,
  ItemData,
  ExpandedContentItem
} from "../../styles/table";
import { shortDate } from "../../constants/dates";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";
import { TableItem } from "../../styles/table";
import Names from "../../components/Names";
import useOrders from "../../redux/hooks/useOrders";

type TOrdered = { productID: number; amount: number };

type TOrder = {
  order: IOrder;
  edit: (id: number) => void;
  columns: string;
  extended: boolean;
};

const Order: React.FC<TOrder> = ({ order, edit, columns, extended }) => {
  const { orderID, supplierID, dateOrdered, ordered } = order;
  const [expanded, setExpanded] = useState(false);
  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );

  const { deleteOrder, receivedOrder } = useOrders();

  const { dark } = useAuthLocation();

  const orderDate = shortDate(dateOrdered);

  let totalOrdered = ordered.reduce(
    (acc: number, cur: TOrdered) => acc + cur.amount,
    0
  );

  const tooltipHandle = `order_${orderID}_`;
  const handles = {
    expand: tooltipHandle + "expand",
    edit: tooltipHandle + "edit",
    delete: tooltipHandle + "delete",
    receive: tooltipHandle + "receive"
  };

  return (
    <>
      <TableItem columns={columns} expanded={expanded ? dark : null}>
        {extended && <ItemData>{orderID}</ItemData>}
        <ItemData>{suppliers[supplierID - 1].name}</ItemData>
        {extended && <ItemData>{orderDate}</ItemData>}
        <ItemData>{totalOrdered}</ItemData>
        <div />
        <div />
        <Buttons.Click
          onClick={() => setExpanded(!expanded)}
          data-tip
          data-for={handles.expand}
        >
          {expanded ? <Icons.Close /> : <Icons.List />}
        </Buttons.Click>
        <Tooltip handle={handles.expand}>
          {expanded ? "Skjul produkter" : "Vis produkter"}
        </Tooltip>
        <Buttons.Click
          onClick={() => edit(orderID)}
          data-tip
          data-for={handles.edit}
        >
          <Icons.Edit />
        </Buttons.Click>
        <Tooltip handle={handles.edit}>Rediger</Tooltip>
        <Buttons.Confirm
          title="Slett bestilling"
          message="Vil du slette denne bestillingen?"
          onConfirm={() => {
            deleteOrder(orderID);
          }}
          data-tip
          data-for={handles.delete}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Tooltip handle={handles.delete}>Slett</Tooltip>
        <Buttons.Confirm
          title="Motta bestilling"
          message="Bekreft mottak av bestilling"
          getDate={true}
          onConfirm={date => {
            receivedOrder(orderID, ordered, date);
          }}
          data-tip
          data-for={handles.receive}
        >
          <Icons.Orders />
        </Buttons.Confirm>
        <Tooltip handle={handles.receive}>Mottak</Tooltip>
      </TableItem>
      {expanded && (
        <ExpandedTableItem expanded={expanded} borderColor={dark}>
          {ordered.map(prod => (
            <ExpandedContentItem
              key={`order_${orderID}_product_${prod.productID}`}
              columns="1fr 2fr 1fr"
            >
              <p>#{prod.productID}</p>
              <p>
                <Names target="products" id={prod.productID} />
              </p>
              <p>{prod.amount}x</p>
            </ExpandedContentItem>
          ))}
        </ExpandedTableItem>
      )}
    </>
  );
};

export default Order;
