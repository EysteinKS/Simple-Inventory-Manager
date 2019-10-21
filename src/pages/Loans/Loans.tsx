import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState, ILoan } from '../../redux/types';
import useSortableList from '../../hooks/useSortableList';
import SectionHeader, { TDirections, Row, Title, RowSplitter, SortingKey, ColumnSplitter, Key } from '../../components/util/SectionHeader';
import styled from 'styled-components';
import { sort, isArrayEmpty } from '../../constants/util';
import CloudStatus from '../../components/util/CloudStatus';
import Icons from '../../components/util/Icons';
import EditLoan from '../../components/inventory/EditModals/EditLoan';
import useLoans from '../../redux/hooks/useLoans';
import Loan from "./Loan"
import { TableWrapper } from '../../styles/table';

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
  const loans = useSelector((state: RootState) => state.loans)
  const customers = useSelector((state: RootState) => state.customers)
  const [isLoanOpen, setLoanOpen] = useState(false)

  const { createNewLoan, editLoan, clearCurrentLoan } = useLoans()

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
      createNewLoan()
      setLoanOpen(true)
    }}>
      Legg til
    </MainButton>
  )

  return(
    <TableWrapper>
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
          editLoan(id)
          setLoanOpen(true)
        }}/>}
      {isLoanOpen && <EditLoan
        isOpen={isLoanOpen}
        close={() => {
          setLoanOpen(false)
          clearCurrentLoan()
        }}/>}
    </TableWrapper>
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