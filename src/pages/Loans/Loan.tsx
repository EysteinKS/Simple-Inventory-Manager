import React, { useState } from "react"
import styled from "styled-components"
import { ILoan } from "../../redux/types"
import useLoans from "../../redux/hooks/useLoans"
import { dateToString } from "../../constants/util"
import Names from "../../components/Names"
import Icons from "../../components/util/Icons"
import Buttons from "../../components/util/Buttons"
import { ExpandedTableItem, TableItem } from "../../styles/table"

type TLoan = {
  loan: ILoan
  edit: (id: number) => void
  index: number
}

const Loan = ({loan, edit, index}: TLoan) => {
  const {
    loanID,
    customerID,
    dateOrdered,
    dateSent,
    ordered
  } = loan
  const [expanded, setExpanded] = useState(false)
  const { deleteLoan, sentLoan, receivedLoan } = useLoans()

  let orderDate = dateToString(dateOrdered)
  let sentDate = dateToString(dateSent)
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0)

  return(
    <>
      <StyledLoan index={index}>
        <p>{loanID}</p>
        <p><Names target="customers" id={customerID}/></p>
        <p>{orderDate}</p>
        <p>{sentDate || "-"}</p>
        <p>{totalProducts}</p>
        <div/>
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button onClick={() => edit(loanID)}><Icons.Edit/></button>
        <Buttons.Confirm
          message="Vil du slette dette lånet?"
          disabled={(dateSent != null)}
          onConfirm={() => {
            deleteLoan(loanID)
          }}>
            <Icons.Delete/>
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft sending av utlån"
          disabled={(dateSent != null)}
          onConfirm={() => {
            sentLoan(loanID, ordered)
          }}>
            <Icons.Unarchive/>
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft mottak av utlån"
          disabled={(dateSent == null)}
          onConfirm={() => {
            receivedLoan(loanID, ordered)
          }}>
            <Icons.Archive/>
        </Buttons.Confirm>
      </StyledLoan>
      {expanded && <ExpandedTableItem expanded={expanded}>
        {ordered.map((prod, i) => (
          <div key={"loan_product_" + i}>{prod.amount}x <Names target="products" id={prod.productID}/></div>
        ))}
      </ExpandedTableItem>}
    </>
  )
}

const StyledLoan = styled(TableItem)`
  grid-template-columns: repeat(5, 11%) 5% repeat(5, 8%);
`

export default Loan