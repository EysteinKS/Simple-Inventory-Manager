import React from "react"
import Icons from "./Icons"

export default function Warning({ children, ...props }) {
  return(
    <>
      <Icons.WarningIcon {...props}/>
      {children ? children : null}
    </>
  )
}