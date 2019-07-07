import React, { ReactNode } from "react"

export default ({ children }: { children: ReactNode }) => {
  return(
    <ul style={{listStyle: "none"}}>
      {children}
    </ul>
  )
}