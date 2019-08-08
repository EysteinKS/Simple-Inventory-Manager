import React, { FC } from "react"

type TConfirm = {
  message: string,
  onConfirm: Function
}

const Confirm: FC<TConfirm> = ({children, message, onConfirm}) => {
  return <button onClick={() => {
    if(window.confirm(message)){
      onConfirm()
    }}}>{children}</button>
}

export default {
  Confirm
}