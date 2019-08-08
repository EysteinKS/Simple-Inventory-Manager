import React from 'react'
import { IReport, RootState } from '../../redux/types';
import { useSelector } from 'react-redux';
import Table, { TableHeader, TableBody, TableRow, ITableColumn } from '../util/SectionTable';
import styled from 'styled-components';

const ReportWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  background-color: white;
  border: 2px solid #ccc;
  padding: 10px;
  margin-top: 10px;
`

const ReportHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 15px;
`

const HeaderText = styled.p`
  text-align: ${(props: {align: string}) => props.align}
`

const useReport = () => useSelector((state: RootState) => 
  state.reports.report.report) as IReport

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
}

const Report: React.FC = () => {
  const report = useReport()

  const reversedChangelog = React.useMemo(() => {
    let arr = [...report.changeLog]
    return arr.reverse()
  }, [report.changeLog])

  const date = new Date(report.date)
  const localeDateString = date.toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const localeTimeString = date.toLocaleTimeString("default")
  const lastChangedBy = report.changeLog[report.changeLog.length - 1].changedBy.name

  return (
    <ReportWrapper>
      <ReportHeader>
        <HeaderText align="left">{localeDateString}</HeaderText>
        <HeaderText align="right"><i>Sist endret </i>{localeTimeString} <i>av </i>{lastChangedBy}</HeaderText>
      </ReportHeader>
      <div>
        {/* Products */}
        <ReportTable name="Products" columns={[
          {name: "ID", width: "20%"}, 
          {name: "NAME", width: "30%"}, 
          {name: "CATEGORY", width: "30%"}, 
          {name: "AMOUNT", width: "20%"}
          ]}>
          {report.products.all.map(product => {
            let columns = [
              product.productID,
              product.name,
              product.category.name,
              product.amount
            ]
            return <TableRow key={"product_row_" + product.productID} columns={columns}/>
          })}
        </ReportTable>
        {/* Orders */}
        <ReportTable name="Orders" columns={[
          {name: "ID", width: "20%"}, 
          {name: "SUPPLIER", width: "30%"}, 
          {name: "DATE", width: "30%"}, 
          {name: "AMOUNT", width: "20%"}
          ]}>
          {report.orders.active.map(order => {
            let columns = [
              order.orderID,
              order.supplier.name,
              new Date(order.dateOrdered).toLocaleString("default", localeStringOpts),
              order.ordered.reduce((acc, cur) => {
                acc += cur.amount
                return acc
              }, 0)
            ]
            return <TableRow key={"order_row_" + order.orderID} columns={columns}/>
          })}
        </ReportTable>
        {/* Sales */}
        <ReportTable name="Sales" columns={[
          {name: "ID", width: "20%"}, 
          {name: "CUSTOMER", width: "30%"}, 
          {name: "DATE", width: "30%"}, 
          {name: "AMOUNT", width: "20%"}
          ]}>
        {report.sales.active.map(sale => {
            let columns = [
              sale.saleID,
              sale.customer.name,
              new Date(sale.dateOrdered).toLocaleString("default", localeStringOpts),
              sale.ordered.reduce((acc, cur) => {
                acc += cur.amount
                return acc
              }, 0)
            ]
            return <TableRow key={"sale_row_" + sale.saleID} columns={columns}/>
          })}
          </ReportTable>
          <ReportTable name="Changelog" columns={[
            {name: "NAME", width: "33%"}, 
            {name: "E-MAIL", width: "34%"}, 
            {name: "DATE", width: "33%"}
            ]}>
            {reversedChangelog.map((log, i) => {
              let columns = [
                log.changedBy.name,
                log.changedBy.email,
                new Date(log.timeChanged).toLocaleString("default", localeStringOpts)
              ]
              if("changes" in log && log.changes.length > 0){

              }
              else return <TableRow key={"log_row_" + i} columns={columns}/>
            })}
          </ReportTable>
      </div>
    </ReportWrapper>
  )
}

interface IReportTable {
  name: string,
  columns: ITableColumn[]
}

const TableButton = styled.button`
  width: 100%;
  display: grid;
  place-content: center;
  height: 7vh;
  background-color: lightgray;
  margin-top: 10px;
`

const ReportTable: React.FC<IReportTable> = ({ name, columns, children }) => {
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

export default Report