import React from "react"

export default ({ children }) => {
  return(
    <ul style={{listStyle: "none"}}>
      {children}
    </ul>
  )
}