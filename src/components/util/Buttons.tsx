import React, { FC } from "react"

type TConfirm = {
  message: string,
  onConfirm: Function
  disabled?: boolean
}

const Confirm: FC<TConfirm> = ({children, message, onConfirm, disabled = false}) => {
  return <button onClick={() => {
    if(window.confirm(message)){
      onConfirm()
    }}} disabled={disabled} >{children}</button>
}

export default {
  Confirm
}