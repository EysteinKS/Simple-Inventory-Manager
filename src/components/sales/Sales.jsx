import React, { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  createSale,
  saveSales,
  editSale,
  clearCurrentSale,
  deleteSale,
  didSendSale
} from "../../redux/actions/salesActions"
import { saveCustomers } from "../../redux/actions/customersActions"

import EditSale from "./EditSale"
import SectionHeader, { Row, Title, Key, SortingKey } from "../SectionHeader"
import CloudStatus from "../CloudStatus"
import Icons from "../Icons"
import Buttons from "../Buttons"
import Names from "../Names"
import {isArrayEmpty, newSale} from "../../constants/util"
import {useGate} from "../../constants/hooks"

export default function Sales(){
  const dispatch = useDispatch()
  const sales = useSelector(state => state.sales)
  const salesList = sales.sortedSales
  const customers = useSelector(state => state.customers)
  const [ isSaleOpen, setSaleOpen ] = useState(false)
  //console.log("isSaleOpen: ", isSaleOpen)

  const buttonStyle = {
    height: "75%",
    width: "75%",
    borderRadius: "15px"
  }

  const NewSaleButton = () => (
    <button style={buttonStyle} onClick={() => {
      dispatch(createSale(newSale(sales.currentID + 1)))
      setSaleOpen(true)
    }}>
    Legg til
    </button>
  )
  const CustomersButton = () => (
    <button style={buttonStyle} onClick={() => {
      //setCustomersOpen(true)
    }}>
    Kunder
    </button>
  )

  const allIsSaving = useMemo(() => [sales.isSaving, customers.isSaving], [sales.isSaving, customers.isSaving])
  const savingGate = useGate(allIsSaving, "OR", "salesIsSaving")
  const allIsSaved = useMemo(() => [sales.isSaved, customers.isSaved], [sales.isSaved, customers.isSaved])
  const savedGate = useGate(allIsSaved, "AND", "salesIsSaved", true)
  const allError = useMemo(() => [sales.savingError, customers.savingError], [sales.savingError, customers.savingError])
  const errorGate = useGate(allError, "OR", "salesLoadingError")

  return(
    <div>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewSaleButton/>
          <CustomersButton/>
          <Title>Salg</Title>
          <br/>
          <CloudStatus 
            save={() => {
              dispatch(saveSales(sales.sales))
              dispatch(saveCustomers(customers.customers))
            }}
            isSaving={savingGate}
            isSaved={savedGate}
            error={errorGate}
          />
        </Row>
        <Row grid="15% 15% 15% 15%">
          <Key>#</Key>
          <Key><Icons.Business/></Key>
          <Key><Icons.AccessTime/></Key>
          <Key><Icons.ShoppingCart/></Key>
        </Row>
      </SectionHeader>
      {(isArrayEmpty(salesList))
        ? null
        : <List list={salesList} edit={id => {
          dispatch(editSale(id))
          setSaleOpen(true)
        }}/>}
        <EditSale
          isOpen={isSaleOpen}
          close={() => {
            setSaleOpen(false)
            dispatch(clearCurrentSale())
          }}
        />
    </div>
  )

}

const List = ({ list, edit }) => {
  if(list){
    return(
      <div>
        {list.map((sale, index) => (
          <Sale sale={sale} key={index} edit={edit}/>
        ))}
      </div>
    )
  } else {
    return <div>No sales found!</div>
  }
}

const Sale = ({ sale, edit }) => {
  const {
    saleID,
    customerID,
    dateOrdered,
    dateSent,
    ordered
  } = sale
  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()
  
  let expandedStyle;
  if(!expanded) {
    expandedStyle = { display: "none" }
  } else {
    expandedStyle = { backgroundColor: "#e6e6e6", padding: "10px", display: "grid", placeItems: "center" }
  }

  let orderDate = dateOrdered.toLocaleDateString(
    "default", {year: "numeric", month: "short", day: "numeric"}
  )
  let totalProducts = ordered.reduce((acc, cur) => acc + cur.amount, 0)

  return(
    <div style={{ marginBottom: "10px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 15%) repeat(5, 8%)",
        justifyItems: "center",
        backgroundColor: "lightgray",
      }}>
        <p>{saleID}</p>
        <p><Names target="customers" id={customerID}/></p>
        <p>{orderDate}</p>
        <p>{totalProducts}</p>
        <div/>
        <button onClick={() => setExpanded(!expanded)}>=</button>
        <button onClick={() => edit(saleID)}><Icons.Edit/></button>
        <Buttons.Confirm
          message="Vil du slette dette salget?"
          onConfirm={() => dispatch(deleteSale(saleID))}
        ><Icons.Delete/></Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft sending av salg"
          onConfirm={() => dispatch(didSendSale(saleID, ordered))}
        >></Buttons.Confirm>
      </div>
      <div style={expandedStyle}>
        {ordered.map((prod, i) => (
          <div key={i}>{prod.amount}x <Names target="products" id={prod.productID}/></div>
        ))}
      </div>
    </div>
  )
}