import React from 'react'
import { useSelector } from "react-redux"
import "./Status.css"

export default () => {
  const list = useSelector(state => state.inventory.inventory)

  return (
    <div>
      <StatusHeader/>
      <List statusList={list}/>
    </div>
  )
}

const StatusHeader = () => {
  return(
    <div className="status-header">
      <p className="header-name">Navn</p>
      <p className="header-inventory">På lager</p>
      <p className="header-ordered">Bestilt</p>
      <p className="header-reserved">Reservert</p>
      <p className="header-total">Sum</p>
    </div>
  )
}

const defaultList = [
  {
  id: 1,
  name: "default product",
  inventory: 0,
  ordered: 0,
  reserved: 0
  }
]

const List = ({ statusList = defaultList }) => {
  return(
    <div className="status-list">
      {statusList.map((prod, index) => <Product prod={prod} key={index}/>)}
    </div>
  )
}

const Product = ({ prod }) => {
  const { name, amount, ordered, reserved } = prod
  const total = amount + (ordered || 0) - (reserved || 0)
  return(
    <div className="product-grid">
      <p className="product-name">{name}</p>
      <p className="product-inventory">{amount || 0}</p>
      <p className="product-ordered">{ordered || 0}</p>
      <p className="product-reserved">{reserved || 0}</p>
      <p className="product-total">{total}</p>
    </div>
  )
}