import React from "react"

const Confirm = ({children, message, onConfirm}) => {
  return <button onClick={() => {
    if(window.confirm(message)){
      onConfirm()
    }}}>{children}</button>
}

export default {
  Confirm
}