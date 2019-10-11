import React, { ReactNode } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/types"
import useLocation from "../../hooks/useLocation"
import Icons from "../util/Icons"
import DropDownMenu from "../util/DropDownMenu"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"
import { navigate, HistoryLocation, NavigateFn } from "@reach/router"
import * as routes from "../../constants/routes"
import { NoMargin } from "./styles"

interface ISection {
  name: string,
  linkTo: string,
  icon: JSX.Element
}

const SectionSelector = () => {
  const userRole = useSelector((state: RootState) => state.auth.user.role)
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
    {name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive/>},
    {name: "Utlån", linkTo: routes.LOANS, icon: <Icons.Cached/>},
    {name: "Logg", linkTo: routes.HISTORY, icon: <Icons.AccessTime/>},
    {name: "Profil", linkTo: routes.PROFILE, icon: <Icons.AccountCircle/>},
    {name: "Admin", linkTo: routes.ADMIN, icon: <Icons.Assessment/>}
  ]

  const filteredSections = React.useMemo(() => {
    let sectionList = sections
    //sectionList = sections.filter(section => section.linkTo !== currentLocation.location.pathname)
    if(userRole !== "admin"){
      sectionList = sectionList.filter(section => section.name !== "Admin")
    }
    return sectionList
  }, [userRole, sections])

  return(
    <div style={{ display: "flex", placeItems: "center" }}>
      <div><CurrentSection onClick={handleToggle} thisRef={anchorRef} sections={sections} current={currentLocation}/></div>
      <DropDownMenu anchorEl={anchorRef.current} open={open} data-style={{width: "33vw", zIndex: "11"}} onClickAway={handleClose}>
        <MenuList style={{paddingTop: "0px"}}>
          {filteredSections.map((section, i)=> {
            return <HeaderLink 
                linkTo={section.linkTo} 
                onClick={handleClose} 
                name={section.name} 
                currentLocation={currentLocation.location.pathname}
                key={"section_" + i}>
              {section.icon}
            </HeaderLink>
          })}
        </MenuList>
      </DropDownMenu>
    </div>
  )
}

type THeaderLink = {
  children: ReactNode,
  linkTo: string,
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  name: string
  currentLocation: string
}

const HeaderLink = ({children, linkTo, onClick, name, currentLocation}: THeaderLink) => {
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
        if(linkTo !== currentLocation) {
          onClick(e)
          navigate(linkTo)
        }
      }}
    >
      <NoMargin>{children}</NoMargin>
      <Typography style={{ placeSelf: "center" }}>{name}</Typography>
    </MenuItem>
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
    <button ref={thisRef} onClick={onClick} style={{width: "33vw", height: "4vh"}}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
      {currentSection && currentSection.icon}
      <Typography style={{placeSelf: "center"}}>{currentSection && currentSection.name}</Typography>
      </div>
    </button>
  )
}

export default SectionSelector