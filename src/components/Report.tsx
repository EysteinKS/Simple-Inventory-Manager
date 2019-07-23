import React from 'react'
import { IReport, RootState } from '../redux/types';
import { parseDate } from '../constants/util';
import { useSelector } from 'react-redux';
import Table, { TableHeader, TableBody, TableRow } from './SectionTable';

interface IProps {
  report: IReport
}

const useReport = () => useSelector((state: RootState) => 
  state.reports.report.report) as IReport

const Report: React.FC = () => {
  const report = useReport()

  const date = new Date(report.date)
  const localeDateString = date.toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const localeTimeString = date.toLocaleTimeString("default")
  const lastChangedBy = report.changeLog[report.changeLog.length - 1].changedBy.name

  return (
    <div style={{ 
      width: "100%", 
      display: "grid",
      gridTemplateColumns: "1fr" 
    }}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
        <p>{localeDateString}</p>
        <p><i>last changed </i>{localeTimeString} <i>by {lastChangedBy}</i></p>
      </div>
      <div>
        {/* Products */}
        <ReportTable name="Products" columns={["ID", "NAME", "CATEGORY", "AMOUNT"]}>
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
        <ReportTable name="Orders" columns={["ID", "SUPPLIER", "DATE", "AMOUNT"]}>
          {report.orders.active.map(order => {
            let columns = [
              order.orderID,
              order.supplier.name,
              new Date(order.dateOrdered).toLocaleString("default"),
              order.ordered.reduce((acc, cur) => {
                acc += cur.amount
                return acc
              }, 0)
            ]
            return <TableRow key={"order_row_" + order.orderID} columns={columns}/>
          })}
        </ReportTable>
        {/* Sales */}
        <ReportTable name="Sales" columns={["ID", "CUSTOMER", "DATE", "AMOUNT"]}>
        {report.sales.active.map(sale => {
            let columns = [
              sale.saleID,
              sale.customer.name,
              new Date(sale.dateOrdered).toLocaleString("default"),
              sale.ordered.reduce((acc, cur) => {
                acc += cur.amount
                return acc
              }, 0)
            ]
            return <TableRow key={"sale_row_" + sale.saleID} columns={columns}/>
          })}
          </ReportTable>
          <ReportTable name="Changelog" columns={["DATE", "NAME", "E-MAIL"]}>
            {report.changeLog.map((log, i) => {
              let columns = [
                new Date(log.timeChanged).toLocaleString("default"),
                log.changedBy.name,
                log.changedBy.email
              ]
              return <TableRow key={"log_row_" + i} columns={columns}/>
            })}
          </ReportTable>
      </div>
      
    </div>
  )
}

interface IReportTable {
  name: string,
  columns: string[]
}

const ReportTable: React.FC<IReportTable> = ({ name, columns, children }) => {
  const [isOpen, setOpen] = React.useState(false)

  return(
    <>
    <button 
      onClick={() => setOpen(!isOpen)}
      style={{ 
        width: "100%", 
        display: "grid", 
        placeContent: "center",
        height: "7vh",
        backgroundColor: "lightgray",
        marginTop: "10px"
      }}
    ><h2 style={{ textAlign: "left", paddingLeft: "10px" }}>{name}</h2></button>
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