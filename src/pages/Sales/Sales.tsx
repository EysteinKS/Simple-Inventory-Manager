import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  createSale,
  editSale,
  clearCurrentSale,
  deleteSale,
  didSendSale
} from "../../redux/actions/salesActions"

import EditSale from "../../components/inventory/EditModals/EditSale"
import SectionHeader, { Row, RowSplitter, ColumnSplitter, Title, Key, SortingKey, TDirections } from "../../components/util/SectionHeader"
import CloudStatus from "../../components/util/CloudStatus"
import Icons from "../../components/util/Icons"
import Buttons from "../../components/util/Buttons"
import Names from "../../components/Names"
import {isArrayEmpty, newSale, sort, dateToString} from "../../constants/util"

import useSortableList from "../../hooks/useSortableList";
import { RootState, ISale } from "../../redux/types";
import { addChange } from "../../redux/actions/reportsActions";

export default function Sales(){
  const dispatch = useDispatch()
  const sales = useSelector((state: RootState) => state.sales)
  const customers = useSelector((state: RootState)  => state.customers)
  const [ isSaleOpen, setSaleOpen ] = useState(false)

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[])
  const { sortedList, setList, sortFunc } = useSortableList(sales.sales)
  useEffect(() => {
    setList(sales.sales)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.sales])
  const sortList = (dir: TDirections, index: number, func: Function) => sortFunc(setSorting)(dir, index, func, sorting)

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

  return(
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
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
    </div>
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

  let orderDate = dateToString(dateOrdered)
  
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
      </div>
      <div style={expandedStyle}>
        {ordered.map((prod, i) => (
          <div key={i}>{prod.amount}x <Names target="products" id={prod.productID}/></div>
        ))}
      </div>
    </div>
  )
}