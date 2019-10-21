import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  createSale,
  editSale,
  clearCurrentSale
} from "../../redux/actions/salesActions"

import EditSale from "../../components/inventory/EditModals/EditSale"
import SectionHeader, { Row, RowSplitter, ColumnSplitter, Title, Key, SortingKey, TDirections } from "../../components/util/SectionHeader"
import CloudStatus from "../../components/util/CloudStatus"
import Icons from "../../components/util/Icons"
import {isArrayEmpty, newSale, sort} from "../../constants/util"

import useSortableList from "../../hooks/useSortableList";
import { RootState, ISale } from "../../redux/types";
import Sale from "./Sale"
import { TableWrapper } from "../../styles/table"
import { HeaderButton } from "./styles"

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

  const NewSaleButton = () => (
    <HeaderButton onClick={() => {
      dispatch(createSale(newSale(sales.currentID + 1)))
      setSaleOpen(true)
    }}>
    Legg til
    </HeaderButton>
  )
  const CustomersButton = () => (
    <HeaderButton onClick={() => {
      //setCustomersOpen(true)
    }}>
    Kunder
    </HeaderButton>
  )

  return(
    <TableWrapper>
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
    </TableWrapper>
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
        {list.map((sale, index) => (
          <Sale sale={sale} key={"sale_" + sale.saleID} edit={edit} index={index}/>
        ))}
      </div>
    )
  } else {
    return <div>No sales found!</div>
  }
}