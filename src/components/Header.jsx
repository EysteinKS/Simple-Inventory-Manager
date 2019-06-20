import React, {useState, useEffect, useMemo} from 'react'
import { navigate } from "@reach/router"
import * as routes from "../constants/routes"
import Icons from "./Icons"
import DropDownMenu from "./DropDownMenu"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"

import useLocation from "../hooks/useLocation"

import { auth, doSignOut } from "../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useDispatch, useSelector } from "react-redux"

import { resetCategories } from "../redux/actions/categoriesActions"
import { resetCustomers } from "../redux/actions/customersActions"
import { resetOrders } from "../redux/actions/ordersActions"
import { resetProducts } from "../redux/actions/productsActions"
import { resetSales } from "../redux/actions/salesActions"
import { resetSuppliers } from "../redux/actions/suppliersActions"

export default function Header({ locationIsLoaded }) {
  const defaultColor = "#a9a9a9"
  const primaryColor = useSelector(state => state.auth.primaryColor)
  const bckColor = useMemo(() => {
    if(primaryColor && locationIsLoaded){
      return primaryColor
    } else {
      return defaultColor
    }
  }, [primaryColor, locationIsLoaded])

  const fixedPosition = {
    position: "fixed",
    width: "100%",
    top: "0",
    zIndex: "10",
  }

  return (
    <header style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      height: "5.1vh",
      columnGap: "2px",
      justifyItems: "center",
      borderBottom: "gray 2px solid",
      backgroundColor: bckColor,
      ...fixedPosition
    }}>
    {locationIsLoaded && <AuthHeader/>}
    </header>
  )
}

const AuthHeader = () => {
  return[
    <SectionSelector/>,
    <LocationSelector/>,
    <UserSelector/>
  ]
}

const LocationSelector = () => {
  const locationName = useSelector(state => state.auth.locationName)
  const locationLogo = useSelector(state => state.auth.logoUrl)

  if(locationLogo){
    return(
      <img src={locationLogo} alt={locationName} style={{ height: "5vh", padding: "0.5rem" }}/>
    )
  }
  return(
    <Typography variant="h4" style={{placeSelf: "center"}}>{locationName || "LAGER"}</Typography>
  )
}

const UserSelector = () => {
  const [user, initialising, error] = useAuthState(auth)
  const authUser = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const resetRedux = () => {
    dispatch(resetCategories())
    dispatch(resetCustomers())
    dispatch(resetOrders())
    dispatch(resetProducts())
    dispatch(resetSales())
    dispatch(resetSuppliers())
  }
  
  const LoggedIn = () => 
    <>
      <Icons.AccountCircle fontSize="large"/>
      <Typography variant="h6" style={{ justifySelf: "left" }}>
        {authUser.firstName} {authUser.lastName}
      </Typography>
      <button onClick={() => {
        doSignOut()
        resetRedux()
      }} style={{padding: "1vh"}}>Logg ut</button>
    </>
  

  const NotLoggedIn = () => 
    <>
      <Typography style={{gridColumn: "1/5"}}>Logg inn</Typography>
    </>
  

  return(
    <div style={{ 
      display: "grid",
      width: "100%",
      gridTemplateColumns: "1fr 4fr 2fr",
      placeItems: "center"
     }}>
      {user ? <LoggedIn/> : <NotLoggedIn/>}
    </div>
  )
}

const HeaderLink = ({children, linkTo, onClick, name}) => {
  return(
    <MenuItem style={{
      position: "relative",
      borderStyle: "outset",
      borderColor: "rgba(255, 255, 255, 0.4)",
      backgroundColor: "#fbfbfb",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      padding: "10px",
      height: "5vh"
    }}
      onClick={e => {
        navigate(linkTo)
        onClick(e)}}
    >
      {children}
      <Typography style={{placeSelf: "center"}}>{name}</Typography>
    </MenuItem>
  )
}

const SectionSelector = () => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const currentLocation = useLocation()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if(anchorRef.current && anchorRef.current.contains(event.target)){
      return
    }
    setOpen(false)
  }

  const CurrentSection = ({onClick, thisRef }) => {
    let currentSection = sections.find(section => section.linkTo === currentLocation.location.pathname)

    return(
      <button ref={thisRef} onClick={onClick} style={{width: "33vw", padding: "10px", height: "5vh"}}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
        {currentSection.icon}
        <Typography style={{placeSelf: "center"}}>{currentSection.name}</Typography>
        </div>
      </button>
    )
  }

  const sections = [
    {name: "Produkter", linkTo: routes.HOME, icon: <Icons.Storage/>},
    {name: "Bestillinger", linkTo: routes.ORDERS, icon: <Icons.Archive/>},
    {name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive/>}
    //{name: "Logg", linkTo: routes.HISTORY, icon: <Icons.Functions/>}
  ]

  const filteredSections = sections.filter(section => section.linkTo !== currentLocation.location.pathname)

  return(
    <div>
      <CurrentSection onClick={handleToggle} thisRef={anchorRef}/>
      <DropDownMenu anchorEl={anchorRef.current} open={open} style={{width: "33vw", zIndex: "11"}} onClickAway={handleClose}>
        <MenuList style={{paddingTop: "0px"}}>
          {filteredSections.map((section, i)=> {
            return <HeaderLink linkTo={section.linkTo} onClick={handleClose} name={section.name} key={i}>
              {section.icon}
            </HeaderLink>
          })}
        </MenuList>
      </DropDownMenu>
    </div>
  )
}