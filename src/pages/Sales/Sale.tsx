import React, { useState } from "react";
import { ISale } from "../../redux/types";
import { useDispatch } from "react-redux";
import { ExpandedTableItem } from "../../styles/table";
import { dateToString } from "../../constants/util";
import Names from "../../components/Names";
import Icons from "../../components/util/Icons";
import { addChange } from "../../redux/actions/reportsActions";
import { deleteSale, didSendSale } from "../../redux/actions/salesActions";
import Buttons from "../../components/util/Buttons";
import { SaleWrapper } from "./styles";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

type TSale = {
  sale: ISale;
  edit: (id: number) => void;
  index: number;
};

const Sale: React.FC<TSale> = ({ sale, edit, index }) => {
  const { saleID, customerID, dateOrdered, ordered } = sale;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const { dark } = useAuthLocation()

  let orderDate = dateToString(dateOrdered);
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0);

  const tooltipHandle = `sale_${saleID}`;
  const handles = {
    expand: tooltipHandle + "expand",
    edit: tooltipHandle + "edit",
    delete: tooltipHandle + "delete",
    send: tooltipHandle + "send"
  }

  return (
    <>
      <SaleWrapper index={index}>
        <p>{saleID}</p>
        <p>
          <Names target="customers" id={customerID} />
        </p>
        <p>{orderDate}</p>
        <p>{totalProducts}</p>
        <div />
        <Buttons.Click 
          onClick={() => setExpanded(!expanded)}
          data-tip data-for={handles.expand}
        >
          {expanded ? "x": "="}
        </Buttons.Click>
        <Tooltip handle={handles.expand}>
          {expanded ? "Skjul produkter" : "Vis produkter"}
        </Tooltip>
        <Buttons.Click 
          onClick={() => edit(saleID)}
          data-tip data-for={handles.edit}
        >
          <Icons.Edit />
        </Buttons.Click>
        <Tooltip handle={handles.edit}>
          Rediger
        </Tooltip>
        <Buttons.Confirm
          message="Vil du slette dette salget?"
          onConfirm={() => {
            dispatch(
              addChange({
                type: "DELETE_SALE",
                id: saleID,
                section: "sales"
              })
            );
            dispatch(deleteSale(saleID));
          }}
          data-tip data-for={handles.delete}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Tooltip handle={handles.delete}>
          Slett
        </Tooltip>
        <Buttons.Confirm
          message="Bekreft sending av salg"
          onConfirm={() => {
            dispatch(
              addChange({
                type: "SENT_SALE",
                id: saleID,
                section: "sales"
              })
            );
            dispatch(didSendSale(saleID, ordered));
          }}
          data-tip data-for={handles.send}
        >
          <Icons.Unarchive/>
        </Buttons.Confirm>
        <Tooltip handle={handles.send}>
          Send
        </Tooltip>
      </SaleWrapper>
      {expanded && (
        <ExpandedTableItem expanded={expanded} color={dark}>
          {ordered.map((prod, i) => (
            <div key={i}>
              {prod.amount}x <Names target="products" id={prod.productID} />
            </div>
          ))}
        </ExpandedTableItem>
      )}
    </>
  );
};

export default Sale;
