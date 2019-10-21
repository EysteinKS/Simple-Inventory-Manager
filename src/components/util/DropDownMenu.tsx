import React, {useState, ReactNode, ChangeEvent} from 'react'
import Popover from "@material-ui/core/Popover"
import { withStyles } from "@material-ui/core/styles"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"

const StyledPopover = withStyles({
  paper: {
    top: "5vh !important",
    left: "67vw !important",
    width: "33vw !important",
    border: "none"
  }
})(Popover)

type TDropDownMenu = {
  anchorEl: HTMLElement,
  open: boolean,
  onClickAway: (event: ChangeEvent<{}>) => void,
  children: ReactNode
}

export default function DropDownMenu({anchorEl, open, children, onClickAway}: TDropDownMenu ) {
  return (
    <StyledPopover anchorEl={anchorEl} open={open} anchorOrigin={{vertical: "center", horizontal: "center"}} transformOrigin={{vertical: "center", horizontal: "center"}}>
      <ClickAwayListener onClickAway={onClickAway}>
        {children}
      </ClickAwayListener>
    </StyledPopover>
  )
}

export const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState(null as (Element | null))

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(anchorEl ? null : event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return [anchorEl, handleClick, handleClose]
}