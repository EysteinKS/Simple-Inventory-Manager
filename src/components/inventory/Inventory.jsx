import React, { useState } from 'react'

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
    <div>
      <Header view={view} setView={setView}/>
      {current}
    </div>
  )
}

const Header = ({ view, setView }) => {
  return(
    <header>
        <h3>Lager</h3>
        <HeaderButton name="Status" value="status" view={view} setView={setView}/>
        <HeaderButton name="Produkter" value="products" view={view} setView={setView}/>
        <HeaderButton name="Bestillinger" value="orders" view={view} setView={setView}/>
        <HeaderButton name="Logg" value="history" view={view} setView={setView}/>
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