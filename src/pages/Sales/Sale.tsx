import React, { useState } from "react"
import { ISale } from "../../redux/types"
import { useDispatch } from "react-redux"
import { ExpandedTableItem } from "../../styles/table"
import { dateToString } from "../../constants/util"
import Names from "../../components/Names"
import Icons from "../../components/util/Icons"
import { addChange } from "../../redux/actions/reportsActions"
import { deleteSale, didSendSale } from "../../redux/actions/salesActions"
import Buttons from "../../components/util/Buttons"
import { SaleWrapper } from "./styles"

type TSale = {
  sale: ISale,
  edit: (id: number) => void
  index: number
}

const Sale: React.FC<TSale> = ({ sale, edit, index }) => {
  const {
    saleID,
    customerID,
    dateOrdered,
    ordered
  } = sale
  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()

  let orderDate = dateToString(dateOrdered)
  
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0)

  return(
    <>
      <SaleWrapper index={index}>
        <p>{saleID}</p>
        <p><Names target="customers" id={customerID}/></p>
        <p>{orderDate}</p>
        <p>{totalProducts}</p>
        <div/>
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button onClick={() => edit(saleID)}><Icons.Edit/></button>
        <Buttons.Confirm
          message="Vil du slette dette salget?"
          onConfirm={() => {
            dispatch(addChange({
              type: "DELETE_SALE",
              id: saleID,
              section: "sales"
            }))
            dispatch(deleteSale(saleID))
          }}
        ><Icons.Delete/></Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft sending av salg"
          onConfirm={() => {
            dispatch(addChange({
              type: "SENT_SALE",
              id: saleID,
              section: "sales"
            }))
            dispatch(didSendSale(saleID, ordered))
          }}
        >></Buttons.Confirm>
      </SaleWrapper>
      {expanded && <ExpandedTableItem expanded={expanded}>
        {ordered.map((prod, i) => (
          <div key={i}>{prod.amount}x <Names target="products" id={prod.productID}/></div>
        ))}
      </ExpandedTableItem>}
    </>
  )
}

export default Sale