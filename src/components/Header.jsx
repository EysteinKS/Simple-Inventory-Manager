import React from 'react'
import { NavLink } from "react-router-dom"
import * as routes from "../constants/routes"
import Icons from "./Icons"

export default function Header() {
  return (
    <header style={{
      display: "grid",
      gridTemplateColumns: "20% repeat(4, 20%)",
      columnGap: "2px",
      justifyItems: "center",
      borderBottom: "gray 2px solid",
      padding: "10px"
    }}>
      <h3 style={{width: "100%"}}>Lager</h3>
      <HeaderButton linkTo={routes.HOME}>
        <Icons.Storage/><br/>
        <b><i>Produkter</i></b>
      </HeaderButton>

      <HeaderButton linkTo={routes.ORDERS}>
        <Icons.Archive/><br/>
        <b><i>Bestillinger</i></b>
      </HeaderButton>

      <HeaderButton linkTo={routes.SALES}>
        <Icons.Unarchive/><br/>
        <b><i>Salg</i></b>
      </HeaderButton>

      <HeaderButton linkTo={routes.HISTORY}>
        <Icons.Functions/><br/>
        <b><i>Logg</i></b>
      </HeaderButton>
    </header>
  )
}

const HeaderButton = ({children, linkTo}) => {
  return(
    <NavLink to={linkTo} activeStyle={{
      color: "blue"
    }}>
      <button style={{
        position: "relative",
        right: "8px",
        borderStyle: "outset",
        borderColor: "rgba(255, 255, 255, 0.4)",
        backgroundColor: "#fbfbfb",
        borderRadius: "15px",
        width: "18vw"
      }}>
        {children}
      </button>
    </NavLink>
  )
}