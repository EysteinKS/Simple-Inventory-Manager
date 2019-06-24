import React, {useState} from 'react'
import Popover from "@material-ui/core/Popover"
import { withStyles } from "@material-ui/core/styles"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"

const StyledPopover = withStyles({
  paper: {
    top: "5vh !important",
    left: "67vw !important",
    width: "33vw !important",
    border: "2px outset rgba(255, 255, 255, 0.4)" 
  }
})(Popover)

export default function DropDownMenu({anchorEl, open, children, onClickAway}) {
  return (
    <StyledPopover anchorEl={anchorEl} open={open} anchorOrigin={{vertical: "center", horizontal: "center"}} transformOrigin={{vertical: "center", horizontal: "center"}}>
      <ClickAwayListener onClickAway={onClickAway}>
        {children}
      </ClickAwayListener>
    </StyledPopover>
  )
}

export const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = e => setAnchorEl(anchorEl ? null : e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return [anchorEl, handleClick, handleClose]
}