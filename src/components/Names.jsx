import React from "react"
import { useSelector } from "react-redux"

export default function Names({target, id}) {
  //console.log("Target: ", target)
  const selector = useSelector(state => state[target][target])
  //console.log("Selector: ", selector)
  const name = selector[id - 1].name
  return(
    <React.Fragment>
      {name}
    </React.Fragment>
  )
}