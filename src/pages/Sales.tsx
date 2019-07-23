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
import SectionHeader, { Row, RowSplitter, ColumnSplitter, Title, Key, SortingKey, TDirections } from "../components/SectionHeader"
import CloudStatus from "../components/CloudStatus"
import Icons from "../components/Icons"
import Buttons from "../components/Buttons"
import Names from "../components/Names"
import {isArrayEmpty, newSale, sort} from "../constants/util"
import useGate from "../hooks/useGate"

import useSortableList from "../hooks/useSortableList";
import produce from "immer";
import { RootState, ISale } from "../redux/types";

export default function Sales(){
  const dispatch = useDispatch()
  const sales = useSelector((state: RootState) => state.sales)
  const customers = useSelector((state: RootState)  => state.customers)
  const [ isSaleOpen, setSaleOpen ] = useState(false)

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[])
  const { sortedList, setList, setSortingFuncs } = useSortableList(sales.sales)
  useEffect(() => {
    setList(sales.sales)
    setSortingFuncs(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.sales])
  const sortList = (dir: TDirections, index: number, func: Function) => {
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
  const savingGate = useGate(allIsSaving, "OR")
  const allIsSaved = useMemo(() => [sales.isSaved, customers.isSaved], [sales.isSaved, customers.isSaved])
  const savedGate = useGate(allIsSaved, "AND", true)
  const allError = useMemo(() => [sales.savingError, customers.savingError], [sales.savingError, customers.savingError])
  const errorGate = useGate(allError, "OR")

  return(
    <>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewSaleButton/>
          <CustomersButton/>
          <Title>Salg</Title>
          <br/>
          <CloudStatus/>
        </Row>
        <RowSplitter/>
        <Row grid="14% 1% 14% 1% 14% 1% 15%">
          <SortingKey onClick={dir => sortList(dir, 0, sort.by("saleID", dir))}>#</SortingKey>
          <ColumnSplitter/>
          <SortingKey onClick={dir => sortList(dir, 1, sort.byCustomer(customers.customers, dir))}><Icons.Business/></SortingKey>
          <ColumnSplitter/>
          <SortingKey onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}><Icons.AccessTime/></SortingKey>
          <ColumnSplitter/>
          <Key><Icons.ShoppingCart/></Key>
        </Row>
      </SectionHeader>
      {(isArrayEmpty(sortedList))
        ? null
        : <List list={sortedList} edit={id => {
          dispatch(editSale(id))
          setSaleOpen(true)
        }}/>}
        {isSaleOpen && <EditSale
          isOpen={isSaleOpen}
          close={() => {
            setSaleOpen(false)
            dispatch(clearCurrentSale())
          }}
        />}
    </>
  )

}

type TList = {
  list: ISale[],
  edit: (id: number) => void
}

const List = ({ list, edit }: TList) => {
  if(list){
    return(
      <div>
        {list.map((sale) => (
          <Sale sale={sale} key={"sale_" + sale.saleID} edit={edit}/>
        ))}
      </div>
    )
  } else {
    return <div>No sales found!</div>
  }
}

type TSale = {
  sale: ISale,
  edit: (id: number) => void
}

const Sale = ({ sale, edit }: TSale) => {
  const {
    saleID,
    customerID,
    dateOrdered,
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

  let orderDate
  if(typeof dateOrdered === "string"){
    let stringToDate = new Date(dateOrdered)
    orderDate = stringToDate.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  } else if (dateOrdered){
    orderDate = dateOrdered.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } else {
    orderDate = null
  }
  
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