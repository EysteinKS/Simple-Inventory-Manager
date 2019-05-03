import React, { useState } from 'react'
import "./Inventory.css"

import Status from "./Status"
import Products from "./Products"
import Orders from "./Orders"
import History from "./History"


export default () => {
  const views = [ "status", "products", "orders", "history" ]
  const [ view, setView ] = useState(views[0])

  let current = null
  switch(view){
    case "status":
      current = <Status/>
      break
    case "products":
      current = <Products/>
      break
    case "orders":
      current = <Orders/>
      break
    case "history":
      current = <History/>
      break
    default:
      break
  }

  return (
    <div className="Inventory">
      <Header view={view} setView={setView}/>
      <div className="Inventory-current">{current}</div>
    </div>
  )
}

const Header = ({ view, setView }) => {
  return(
    <header className="Inventory-header">
        <h3>Lager</h3>
        {[["Status", "status"], ["Produkter", "products"], ["Bestillinger", "orders"], ["Logg", "history"]].map((btn, i) => {
          let name = btn[0]
          let value = btn[1]
          return <HeaderButton name={name} value={value} view={view} setView={setView} key={i}/>
        })}
      </header>
  )
}

const HeaderButton = ({ name, value, view, setView }) => {
  let style = "btn-inactive"
  if (view === value){
    style = "btn-active"  
  }
  return(
    <button
      className={style}
      onClick={() => setView(value)}
    >
      {name}
    </button>
  )
}