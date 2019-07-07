import React, {useMemo, ReactNode} from 'react'
import { navigate, HistoryLocation, NavigateFn } from "@reach/router"
import * as routes from "../constants/routes"
import Icons from "./Icons"
import DropDownMenu from "./DropDownMenu"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"

import useLocation from "../hooks/useLocation"
import Notifications from "./Notifications"

import { auth, doSignOut } from "../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useDispatch, useSelector } from "react-redux"

import { clearLocalStorage } from "../redux/middleware/localStorage"
import { resetCategories } from "../redux/actions/categoriesActions"
import { resetCustomers } from "../redux/actions/customersActions"
import { resetOrders } from "../redux/actions/ordersActions"
import { resetProducts } from "../redux/actions/productsActions"
import { resetSales } from "../redux/actions/salesActions"
import { resetSuppliers } from "../redux/actions/suppliersActions"
import { resetAuth } from "../redux/actions/authActions"
import { RootState, AuthState } from '../redux/types';

type THeader = {
  locationIsLoaded: boolean
}

export default function Header({ locationIsLoaded }: THeader) {
  const defaultColor = "#a9a9a9"
  const primaryColor = useSelector((state: RootState) => state.auth.primaryColor)
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
    } as any}>
    {locationIsLoaded && <AuthHeader/>}
    </header>
  )
}

const AuthHeader = () => {
  return(
    <>
      <LocationSelector/>
      <UserSelector/>
      <SectionSelector/>
    </>
  )
}

const LocationSelector = () => {
  const locationName = useSelector((state: RootState) => state.auth.locationName)
  const locationLogo = useSelector((state: RootState) => state.auth.logoUrl)

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
  const [user] = useAuthState(auth)
  const authUser = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const resetRedux = () => {
    dispatch(resetAuth())
    dispatch(resetCategories())
    dispatch(resetCustomers())
    dispatch(resetOrders())
    dispatch(resetProducts())
    dispatch(resetSales())
    dispatch(resetSuppliers())
  }

  return(
    <div style={{ 
      display: "grid",
      width: "100%",
      gridTemplateColumns: "1fr 4fr 2fr",
      placeItems: "center"
     }}>
      {user ? <LoggedIn authUser={authUser} resetRedux={resetRedux}/> : <NotLoggedIn/>}
    </div>
  )
}

type TLoggedIn = {
  authUser: AuthState,
  resetRedux: () => void
}

const LoggedIn = ({ authUser, resetRedux }: TLoggedIn) => 
<>
  <Icons.AccountCircle fontSize="large"/>
  <div style={{ justifySelf: "left", display: "flex" }}>
    <><Typography>{authUser.firstName}&nbsp;</Typography></>
    <><Typography>{authUser.lastName}</Typography></>
  </div>
  {/*<Notifications/>*/}
  <button onClick={() => {
    console.log("Signing out")
    doSignOut()
    clearLocalStorage()
    console.log("Resetting redux")
    resetRedux()
  }} style={{padding: "1vh"}}>Logg ut</button>
</>

const NotLoggedIn = () => 
<>
  <Typography style={{gridColumn: "1/5"}}>Logg inn</Typography>
</>

type THeaderLink = {
  children: ReactNode,
  linkTo: string,
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  name: string
}

const HeaderLink = ({children, linkTo, onClick, name}: THeaderLink) => {
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
      <Typography style={{ placeSelf: "center" }}>{name}</Typography>
    </MenuItem>
  )
}

interface ISection {
  name: string,
  linkTo: string,
  icon: JSX.Element
}

const SectionSelector = () => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null as any)
  const currentLocation = useLocation()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.ChangeEvent<{}> | React.MouseEvent<HTMLElement, MouseEvent>)=> {
    if(anchorRef.current && anchorRef.current.contains(event.target)){
      return
    }
    setOpen(false)
  }

  const sections: ISection[] = [
    {name: "Produkter", linkTo: routes.HOME, icon: <Icons.Storage/>},
    {name: "Bestillinger", linkTo: routes.ORDERS, icon: <Icons.Archive/>},
    {name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive/>}
    //{name: "Logg", linkTo: routes.HISTORY, icon: <Icons.Functions/>}
  ]

  const filteredSections = sections.filter(section => section.linkTo !== currentLocation.location.pathname)

  return(
    <div style={{ display: "flex", placeItems: "center" }}>
      <div><CurrentSection onClick={handleToggle} thisRef={anchorRef} sections={sections} current={currentLocation}/></div>
      <DropDownMenu anchorEl={anchorRef.current} open={open} data-style={{width: "33vw", zIndex: "11"}} onClickAway={handleClose}>
        <MenuList style={{paddingTop: "0px"}}>
          {filteredSections.map((section, i)=> {
            return <HeaderLink linkTo={section.linkTo} onClick={handleClose} name={section.name} key={"section_" + i}>
              {section.icon}
            </HeaderLink>
          })}
        </MenuList>
      </DropDownMenu>
    </div>
  )
}

type TCurrentSection = {
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  thisRef: React.MutableRefObject<any>,
  sections: ISection[],
  current: {
    location: HistoryLocation,
    navigate: NavigateFn
  }
}

const CurrentSection = ({onClick, thisRef, sections, current }: TCurrentSection) => {
  let currentSection = sections.find(section => section.linkTo === current.location.pathname) as ISection

  return(
    <button ref={thisRef} onClick={onClick} style={{width: "33vw", height: "80%"}}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
      {currentSection.icon}
      <Typography style={{placeSelf: "center"}}>{currentSection.name}</Typography>
      </div>
    </button>
  )
}