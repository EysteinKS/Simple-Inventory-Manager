import React, {useState} from 'react'
import Icons from "./Icons"

import { withStyles } from '@material-ui/styles'
import Badge from "@material-ui/core/Badge"
import Popover from "@material-ui/core/Popover"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"

export default function Notifications() {
  let notificationList = [{id: 1, message: "iPad Pro 12\" is missing 3"}, {id: 2, message: "Windfall Pro is missing 5"}]
  let notificationAmount = notificationList.length

  if(notificationAmount === 0){
    return <Icons.Notifications/>
  } else {
    return <WithNotifications amount={notificationAmount} list={notificationList}/>
  }
}

const StyledBadge = withStyles({
  badge: {
    height: "30px",
    minWidth: "30px",
    borderRadius: "15px"
  }
})(Badge)

const StyledPopover = withStyles({
  paper: {
    top: "5vh !important",
    left: "34vw !important",
    width: "33vw !important",
    border: "2px outset rgba(255, 255, 255, 0.4)" 
  }
})(Popover)

type TWithNotifications = {
  amount: number,
  list: any[]
}

const WithNotifications = ({amount, list}: TWithNotifications) => {
  const [anchorEl, setAnchorEl] = useState(null)

  function handleClick(event: any){
    setAnchorEl(event.currentTarget)
  }

  function handleClose(){
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return(
    <>
      <StyledBadge badgeContent={amount} color="error" onClick={handleClick}><Icons.NotificationsActive/></StyledBadge>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <PopoverContent list={list}/>
      </StyledPopover>
    </>
  )
}

const PopoverContent = ({list}: {list: any[]}) => {
  return(
    <List>
      {list.map(n => <ListItem key={"notification_" + n.id}>{n.message}</ListItem>)}
    </List>
  )
}