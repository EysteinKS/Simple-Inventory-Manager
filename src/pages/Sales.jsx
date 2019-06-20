import React, { useState, useMemo, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  createSale,
  saveSales,
  editSale,
  clearCurrentSale,
  deleteSale,
  didSendSale
} from "../redux/actions/salesActions"
import { saveCustomers } from "../redux/actions/customersActions"

import EditSale from "../components/EditSale"
import SectionHeader, { Row, RowSplitter, Title, Key, SortingKey } from "../components/SectionHeader"
import CloudStatus from "../components/CloudStatus"
import Icons from "../components/Icons"
import Buttons from "../components/Buttons"
import Names from "../components/Names"
import {isArrayEmpty, newSale, sort} from "../constants/util"
import useGate from "../hooks/useGate"

import useSortableList from "../hooks/useSortableList";
import produce from "immer";

export default function Sales(){
  const dispatch = useDispatch()
  const sales = useSelector(state => state.sales)
  const customers = useSelector(state => state.customers)
  const [ isSaleOpen, setSaleOpen ] = useState(false)

  //SORTING
  const [sorting, setSorting] = useState([null, null, null])
  const [sortedList, setList, setSortingFuncs] = useSortableList(sales.sales)
  useEffect(() => {
    setList(sales.sales)
    setSortingFuncs(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.sales])
  const sortList = (dir, index, func) => {
    if (dir !== null) {
      let newSorting = produce(sorting, draft => {
        draft[index] = func;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    } else {
      let newSorting = produce(sorting, draft => {
        draft[index] = null;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    }
  }

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
    <>
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
        <RowSplitter/>
        <Row grid="15% 15% 15% 15%">
          <SortingKey onClick={dir => sortList(dir, 0, sort.by("saleID", dir))}>#</SortingKey>
          <SortingKey onClick={dir => sortList(dir, 1, sort.byCustomer(customers.customers, dir))}><Icons.Business/></SortingKey>
          <SortingKey onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}><Icons.AccessTime/></SortingKey>
          <Key><Icons.ShoppingCart/></Key>
        </Row>
      </SectionHeader>
      {(isArrayEmpty(sortedList))
        ? null
        : <List list={sortedList} edit={id => {
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
    </>
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