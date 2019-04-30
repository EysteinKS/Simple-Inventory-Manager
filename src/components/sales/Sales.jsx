import React from 'react'
import "./Sales.css"

export default () => {
  return (
    <div className="Sales">
      <Header/>
    </div>
  )
}


const Header = () => {
  return(
    <header className="Sales-header">
      <h3>Salg</h3>
    </header>
  )
}