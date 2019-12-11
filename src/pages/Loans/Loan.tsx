import React, { useState } from "react";
import { ILoan } from "../../redux/types";
import useLoans from "../../redux/hooks/useLoans";
import { dateToString } from "../../constants/util";
import Names from "../../components/Names";
import Icons from "../../components/util/Icons";
import Buttons from "../../components/util/Buttons";
import {
  ExpandedTableItem,
  TableItem,
  ItemData,
  ExpandedContentItem
} from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

type TLoan = {
  loan: ILoan;
  edit: (id: number) => void;
  columns: string;
  extended: boolean;
};

const Loan = ({ loan, edit, columns, extended }: TLoan) => {
  const { loanID, customerID, dateOrdered, dateSent, ordered } = loan;
  const [expanded, setExpanded] = useState(false);
  const { deleteLoan, sentLoan, receivedLoan } = useLoans();

  const { dark } = useAuthLocation();

  let orderDate = dateToString(dateOrdered);
  let sentDate = dateToString(dateSent);
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0);

  const tooltipHandle = `loan_${loanID}`;
  const handles = {
    expand: tooltipHandle + "expand",
    edit: tooltipHandle + "edit",
    delete: tooltipHandle + "delete",
    send: tooltipHandle + "send",
    receive: tooltipHandle + "receive"
  };

  return (
    <>
      <TableItem columns={columns} expanded={expanded ? dark : null}>
        {extended && <ItemData>{loanID}</ItemData>}
        <ItemData>
          <Names target="customers" id={customerID} />
        </ItemData>
        {extended && <ItemData>{orderDate}</ItemData>}
        {extended && <ItemData>{sentDate || "-"}</ItemData>}
        <ItemData>{totalProducts}</ItemData>
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
          onClick={() => edit(loanID)}
          data-tip
          data-for={handles.edit}
        >
          <Icons.Edit />
        </Buttons.Click>
        <Tooltip handle={handles.edit}>Rediger</Tooltip>

        <Buttons.Confirm
          message="Vil du slette dette lånet?"
          disabled={dateSent != null}
          onConfirm={() => {
            deleteLoan(loanID);
          }}
          data-tip
          data-for={handles.delete}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Tooltip handle={handles.delete}>Slett</Tooltip>

        <Buttons.Confirm
          message="Bekreft sending av utlån"
          disabled={dateSent != null}
          onConfirm={() => {
            sentLoan(loanID, ordered);
          }}
          data-tip
          data-for={handles.send}
        >
          <Icons.Sales />
        </Buttons.Confirm>
        <Tooltip handle={handles.send}>Send</Tooltip>

        <Buttons.Confirm
          message="Bekreft mottak av utlån"
          disabled={dateSent == null}
          onConfirm={() => {
            receivedLoan(loanID, ordered);
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
              key={`loan_${loanID}_product_${prod.productID}`}
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

export default Loan;
