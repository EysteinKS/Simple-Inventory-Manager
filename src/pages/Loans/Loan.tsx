import React, { useState } from "react";
import styled from "styled-components";
import { ILoan } from "../../redux/types";
import useLoans from "../../redux/hooks/useLoans";
import { dateToString } from "../../constants/util";
import Names from "../../components/Names";
import Icons from "../../components/util/Icons";
import Buttons from "../../components/util/Buttons";
import { ExpandedTableItem, TableItem } from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

type TLoan = {
  loan: ILoan;
  edit: (id: number) => void;
  index: number;
};

const Loan = ({ loan, edit, index }: TLoan) => {
  const { loanID, customerID, dateOrdered, dateSent, ordered } = loan;
  const [expanded, setExpanded] = useState(false);
  const { deleteLoan, sentLoan, receivedLoan } = useLoans();

  const { dark } = useAuthLocation()

  let orderDate = dateToString(dateOrdered);
  let sentDate = dateToString(dateSent);
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0);

  const tooltipHandle = `loan_${loanID}`
  const handles = {
    expand: tooltipHandle + "expand",
    edit: tooltipHandle + "edit",
    delete: tooltipHandle + "delete",
    send: tooltipHandle + "send",
    receive: tooltipHandle + "receive"
  }

  return (
    <>
      <StyledLoan index={index}>
        <p>{loanID}</p>
        <p>
          <Names target="customers" id={customerID} />
        </p>
        <p>{orderDate}</p>
        <p>{sentDate || "-"}</p>
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
          onClick={() => edit(loanID)}
          data-tip data-for={handles.edit}
        >
          <Icons.Edit />
        </Buttons.Click>
        <Tooltip handle={handles.edit}>
          Rediger
        </Tooltip>

        <Buttons.Confirm
          message="Vil du slette dette lånet?"
          disabled={dateSent != null}
          onConfirm={() => {
            deleteLoan(loanID);
          }}
          data-tip data-for={handles.delete}
        >
          <Icons.Delete />
        </Buttons.Confirm>
        <Tooltip handle={handles.delete}>
          Slett
        </Tooltip>

        <Buttons.Confirm
          message="Bekreft sending av utlån"
          disabled={dateSent != null}
          onConfirm={() => {
            sentLoan(loanID, ordered);
          }}
          data-tip data-for={handles.send}
        >
          <Icons.Unarchive />
        </Buttons.Confirm>
        <Tooltip handle={handles.send}>
          Send
        </Tooltip>

        <Buttons.Confirm
          message="Bekreft mottak av utlån"
          disabled={dateSent == null}
          onConfirm={() => {
            receivedLoan(loanID, ordered);
          }}
          data-tip data-for={handles.receive}
        >
          <Icons.Archive />
        </Buttons.Confirm>
        <Tooltip handle={handles.receive}>
          Mottak
        </Tooltip>
        
      </StyledLoan>
      {expanded && (
        <ExpandedTableItem expanded={expanded} color={dark}>
          {ordered.map((prod, i) => (
            <div key={"loan_product_" + i}>
              {prod.amount}x <Names target="products" id={prod.productID} />
            </div>
          ))}
        </ExpandedTableItem>
      )}
    </>
  );
};

const StyledLoan = styled(TableItem)`
  grid-template-columns: 10% repeat(3, 15%) 10% 5% repeat(5, 6%);
`;

export default Loan;
