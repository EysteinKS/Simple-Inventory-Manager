import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import styled from 'styled-components';
import Table, { ITableColumn, TableBody, TableHeader, TableRow } from './SectionTable';

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
}

const Completed = () => {
  const orderHistory = useSelector((state: RootState) => state.orders.history)
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const saleHistory = useSelector((state: RootState) => state.sales.history)
  const customers = useSelector((state: RootState) => state.customers.customers)

  const ordersColumns = React.useMemo(() => {
    return [
      {name: "ID", width: "20%"},
      {name: "SUPPLIER", width: "20%"},
      {name: "ORDERED", width: "20%"},
      {name: "RECEIVED", width: "20%"},
      {name: "AMOUNT", width: "20%"}
    ]
  }, [])

  const ordersContent = React.useMemo(() => {
    console.log("Calculating content in orders history")
    let sorted = orderHistory.sort((a, b) => {
      return a.orderID - b.orderID
    })
    return sorted.map(order => {
      let supplierName = suppliers[suppliers.findIndex(i => i.supplierID === order.supplierID)].name
      let ordered = new Date(order.dateOrdered as string).toLocaleString("default", localeStringOpts)
      let received = new Date(order.dateReceived as string).toLocaleString("default", localeStringOpts)
      let amount = order.ordered.reduce((acc, cur) => {
        acc += cur.amount
        return acc
      }, 0)
      let columns = [
        order.orderID,
        supplierName,
        ordered,
        received,
        amount
      ]
      return <TableRow key={"order_history_" + order.orderID} columns={columns}/>
    })
  }, [orderHistory, suppliers])

  const salesColumns = React.useMemo(() => {
    return [
      {name: "ID", width: "20%"},
      {name: "CUSTOMER", width: "20%"},
      {name: "ORDERED", width: "20%"},
      {name: "SENT", width: "20%"},
      {name: "AMOUNT", width: "20%"}
    ]
  }, [])

  const salesContent = React.useMemo(() => {
    console.log("Calculating content in sales history")
    let sorted = saleHistory.sort((a, b) => {
      return a.saleID - b.saleID
    })
    return sorted.map(sale => {
      let customerName = customers[customers.findIndex(i => i.customerID === sale.customerID)].name
      let ordered = new Date(sale.dateOrdered as string).toLocaleString("default", localeStringOpts)
      let sent = new Date(sale.dateSent as string).toLocaleString("default", localeStringOpts)
      let amount = sale.ordered.reduce((acc, cur) => {
        acc += cur.amount
        return acc
      }, 0)
      let columns = [
        sale.saleID,
        customerName,
        ordered,
        sent,
        amount
      ]
      return <TableRow key={"order_history_" + sale.saleID} columns={columns}/>
    })
  }, [saleHistory, customers])

  return (
    <div>
      {/* ORDERS */}
      <HistoryTable name="Orders" columns={ordersColumns}>
        {ordersContent}
      </HistoryTable>
      {/* SALES */}
      <HistoryTable name="Sales" columns={salesColumns}>
        {salesContent}
      </HistoryTable>
    </div>
  )
}

const TableButton = styled.button`
  width: 100%;
  display: grid;
  place-content: center;
  height: 7vh;
  background-color: lightgray;
  margin-top: 10px;
`

interface IHistoryTable {
  name: string,
  columns: ITableColumn[]
}

const HistoryTable: React.FC<IHistoryTable> = ({name, columns, children}) => {
  const [isOpen, setOpen] = React.useState(false)

  return(
    <>
    <TableButton onClick={() => setOpen(!isOpen)}>
      <h2 style={{ textAlign: "left", paddingLeft: "10px" }}>
        {name}
      </h2>
    </TableButton>
    {isOpen && <Table>
      <TableHeader columns={columns}/>
      <TableBody>
        {children}
      </TableBody>
    </Table>}
    </>
  )
}

export default Completed