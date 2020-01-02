import React, { useState } from "react";
import { ISale } from "../../redux/types";
import {
  ExpandedTableItem,
  ItemData,
  ExpandedContentItem
} from "../../styles/table";
import { dateToString } from "../../constants/util";
import Names from "../../components/Names";
import Icons from "../../components/util/Icons";
import Buttons from "../../components/util/Buttons";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";
import { TableItem } from "../../styles/table";
import useSales from "../../redux/hooks/useSales";

type TSale = {
  sale: ISale;
  edit: (id: number) => void;
  columns: string;
  extended: boolean;
};

const Sale: React.FC<TSale> = ({ sale, edit, columns, extended }) => {
  const { toggleReady, deleteSale, sendSale } = useSales();

  const { saleID, customerID, dateOrdered, ordered } = sale;
  const [expanded, setExpanded] = useState(false);

  const { dark } = useAuthLocation();

  let orderDate = dateToString(dateOrdered);
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0);

  const tooltipHandle = `sale_${saleID}`;
  const handles = {
    expand: tooltipHandle + "expand",
    edit: tooltipHandle + "edit",
    delete: tooltipHandle + "delete",
    send: tooltipHandle + "send"
  };

  const saleIsReady = sale.isReady || false;

  return (
    <>
      <TableItem columns={columns} expanded={expanded ? dark : null}>
        {extended && <ItemData>{saleID}</ItemData>}
        <ItemData>
          <Names target="customers" id={customerID} />
        </ItemData>
        {extended && <ItemData>{orderDate}</ItemData>}
        <ItemData>{totalProducts}</ItemData>
        <ItemData>
          {saleIsReady ? (
            <Icons.Checkbox onClick={() => toggleReady(saleID)} />
          ) : (
            <Icons.CheckboxBlank onClick={() => toggleReady(saleID)} />
          )}
        </ItemData>

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
          onClick={() => edit(saleID)}
          data-tip
          data-for={handles.edit}
        >
          <Icons.Edit />
        </Buttons.Click>
        <Tooltip handle={handles.edit}>Rediger</Tooltip>

        <Buttons.Confirm
          title="Slett salg"
          message="Vil du slette dette salget?"
          onConfirm={() => deleteSale(saleID)}
          data-tip
          data-for={handles.delete}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Tooltip handle={handles.delete}>Slett</Tooltip>

        <Buttons.Confirm
          title="Send salg"
          message="Bekreft sending av salg"
          getDate={true}
          onConfirm={date => sendSale(saleID, ordered, date)}
          data-tip
          data-for={handles.send}
        >
          <Icons.Sales />
        </Buttons.Confirm>
        <Tooltip handle={handles.send}>Send</Tooltip>
      </TableItem>
      {expanded && (
        <ExpandedTableItem expanded={expanded} borderColor={dark}>
          {ordered.map(prod => (
            <ExpandedContentItem
              key={`sale_${saleID}_product_${prod.productID}`}
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

export default Sale;
