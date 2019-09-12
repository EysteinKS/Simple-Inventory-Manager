import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, ILoan } from '../redux/types';
import useSortableList from '../hooks/useSortableList';
import SectionHeader, { TDirections, Row, Title, RowSplitter, SortingKey, ColumnSplitter, Key } from '../components/util/SectionHeader';
import styled from 'styled-components';
import { createLoan, deleteLoan, didSendLoan, didReceiveLoan, editLoan, clearCurrentLoan } from '../redux/actions/loansActions';
import { newLoan, sort, isArrayEmpty, dateToString } from '../constants/util';
import CloudStatus from '../components/util/CloudStatus';
import Icons from '../components/util/Icons';
import Names from '../components/Names';
import Buttons from '../components/util/Buttons';
import { addChange } from '../redux/actions/reportsActions';
import EditLoan from '../components/inventory/EditModals/EditLoan';

/*
TODO

CREATE SIMILAR PAGE TO ORDERS AND SALES, BUT SPLIT BY ORDERED AND SENT
NEEDS BUTTON TO SEND AND TO RECEIVE

*/

const MainButton = styled.button`
  height: 75%;
  width: 75%;
  border-radius: 15px;
`

export default function Loans() {
  const dispatch = useDispatch()
  const loans = useSelector((state: RootState) => state.loans)
  const customers = useSelector((state: RootState) => state.customers)
  const [isLoanOpen, setLoanOpen] = useState(false)

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[])
  const { sortedList, setList, sortFunc } = useSortableList(loans.loans)

  useEffect(() => {
    setList(loans.loans)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans.loans])

  const sortList = (dir: TDirections, index: number, func: Function) => sortFunc(setSorting)(dir, index, func, sorting)

  const NewLoanButton = () => (
    <MainButton onClick={() => {
      dispatch(createLoan(newLoan(loans.currentID + 1)))
      setLoanOpen(true)
    }}>
      Legg til
    </MainButton>
  )

  return(
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewLoanButton/>
          <div/>
          <Title>Utlån</Title>
          <div/>
          <CloudStatus/>
        </Row>
        <RowSplitter/>
        <Row grid="10% 1% 10% 1% 10% 1% 10% 1% 15%">
          <SortingKey onClick={dir => sortList(dir, 0, sort.by("loanID", dir))}>#</SortingKey>
          <ColumnSplitter/>
          <SortingKey onClick={dir => sortList(dir, 1, sort.byCustomer(customers.customers, dir))}><Icons.Business/></SortingKey>
          <ColumnSplitter/>
          <SortingKey onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}><Icons.AccessTime/></SortingKey>
          <ColumnSplitter/>
          <SortingKey onClick={dir => sortList(dir, 2, sort.by("dateSent", dir))}><Icons.Unarchive/></SortingKey>
          <ColumnSplitter/>
          <Key><Icons.ShoppingCart/></Key>
        </Row>
      </SectionHeader>
      {(isArrayEmpty(sortedList))
        ? null
        : <List list={sortedList} edit={id => {
          dispatch(editLoan(id))
          setLoanOpen(true)
        }}/>}
      {isLoanOpen && <EditLoan
        isOpen={isLoanOpen}
        close={() => {
          setLoanOpen(false)
          dispatch(clearCurrentLoan())
        }}/>}
    </div>
  )
}

type TList = {
  list: ILoan[],
  edit: (id: number) => void
}

const List = ({ list, edit }: TList) => {
  if(!list) return <div>No loans found!</div>
  return(
    <div>
      {list.map((loan, i) => <Loan key={"loans_" + i} loan={loan} edit={edit} index={i}/>)}
    </div>
  )
}

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
  const dispatch = useDispatch()

  let expandedStyle;
  if(!expanded) {
    expandedStyle = { display: "none" }
  } else {
    expandedStyle = { backgroundColor: "#e6e6e6", padding: "10px", display: "grid", placeItems: "center" }
  }

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
        <button disabled={(dateSent != null)} onClick={() => edit(loanID)}><Icons.Edit/></button>
        <Buttons.Confirm
          message="Vil du slette dette lånet?"
          disabled={(dateSent != null)}
          onConfirm={() => {
            dispatch(addChange({
              type: "DELETE_LOAN",
              id: loanID,
              section: "loans"
            }))
            dispatch(deleteLoan(loanID))
          }}>
            <Icons.Delete/>
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft sending av utlån"
          disabled={(dateSent != null)}
          onConfirm={() => {
            dispatch(addChange({
              type: "SENT_LOAN",
              id: loanID,
              section: "loans"
            }))
            dispatch(didSendLoan(loanID, ordered))
          }}>
            <Icons.Unarchive/>
        </Buttons.Confirm>
        <Buttons.Confirm
          message="Bekreft mottak av utlån"
          disabled={(dateSent == null)}
          onConfirm={() => {
            dispatch(addChange({
              type: "RECEIVED_LOAN",
              id: loanID,
              section: "loans"
            }))
            dispatch(didReceiveLoan(loanID, ordered))
          }}>
            <Icons.Archive/>
        </Buttons.Confirm>
      </StyledLoan>
      {expanded && <div style={expandedStyle}>
        {ordered.map((prod, i) => (
          <div key={"loan_product_" + i}>{prod.amount}x <Names target="products" id={prod.productID}/></div>
        ))}
      </div>}
    </>
  )
}

const StyledLoan = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 11%) 5% repeat(5, 8%);
  justify-items: center;
  background-color: ${(props: {index: number}) => {
    if(props.index % 2 === 0){
      return "#E2E2E2"
    } else {
      return "#F3F3F3"
    }
  }};
`