import React from 'react'

export default () => {
  return (
    <div>
      <StatusHeader/>
      <List statusList={null}/>
    </div>
  )
}

const StatusHeader = () => {
  return(
    <div className="header-grid">
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
  const { name, inventory, ordered, reserved } = prod
  const total = inventory + ordered - reserved
  return(
    <div className="product-grid">
      <p className="product-name">{name}</p>
      <p className="product-inventory">{inventory}</p>
      <p className="product-ordered">{ordered}</p>
      <p className="product-reserved">{reserved}</p>
      <p className="product-total">{total}</p>
    </div>
  )
}