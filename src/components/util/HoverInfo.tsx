import React from 'react'
import ReactTooltip from "react-tooltip"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/types"

const HoverInfo: React.FC<{handle: string}> = ({handle, children}) => {
  return(
    <ReactTooltip id={handle} place="bottom" type="dark" effect="solid">
      {children}
    </ReactTooltip>
  )
}

interface IProps {
  productID: number
  handle: string
}


export const OrdersInfo: React.FC<IProps> = ({ productID, handle }) => {
  const ordersWithProduct = useSelector((state: RootState) => {
    const allOrders = state.orders.orders
    const filteredOrders = allOrders.filter(order => {
      let doesContainProduct = false
      order.ordered.forEach(order => {
        if(doesContainProduct === false){
          if(order.productID === productID){
            doesContainProduct = true
          }
        }
      })
      return doesContainProduct
    })
    return filteredOrders
  })

  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)

  const orderedArray = React.useMemo(() => {
    return ordersWithProduct.map(order => {
      const productOrder = order.ordered[order.ordered.findIndex(line => line.productID === productID)]
      const supplierName = suppliers[suppliers.findIndex(supp => supp.supplierID === order.supplierID)].name
      return {id: order.orderID, name: supplierName, amount: productOrder.amount} 
    })
  }, [productID, ordersWithProduct, suppliers])

  return(
    <HoverInfo handle={handle}>
      {orderedArray.map(order => <InfoRow key={"product_orders_" + order.id} name={order.name} amount={order.amount}/>)}
    </HoverInfo>
  )
}

export const SalesInfo: React.FC<IProps> = ({ productID, handle }) => {
  const salesWithProduct = useSelector((state: RootState) => {
    const allOrders = state.sales.sales
    const filteredOrders = allOrders.filter(order => {
      let doesContainProduct = false
      order.ordered.forEach(order => {
        if(doesContainProduct === false){
          if(order.productID === productID){
            doesContainProduct = true
          }
        }
      })
      return doesContainProduct
    })
    return filteredOrders
  })

  const customers = useSelector((state: RootState) => state.customers.customers)

  const orderedArray = React.useMemo(() => {
    return salesWithProduct.map(sale => {
      const productOrder = sale.ordered[sale.ordered.findIndex(line => line.productID === productID)]
      const customerName = customers[customers.findIndex(cust => cust.customerID === sale.customerID)].name
      return {id: sale.saleID, name: customerName, amount: productOrder.amount} 
    })
  }, [productID, salesWithProduct, customers])

  return(
    <HoverInfo handle={handle}>
      {orderedArray.map(order => <InfoRow key={"product_orders_" + order.id} name={order.name} amount={order.amount}/>)}
    </HoverInfo>
  )
}

interface InfoRowProps {
  name: string
  amount: number
}

const InfoRow: React.FC<InfoRowProps> = ({name, amount}) => {
  return(
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", placeItems: "center"}}>
      <p>{amount}x</p>
      <p>-></p>
      <p>{name}</p>
    </div>
  )
}

export default HoverInfo