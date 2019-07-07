import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/types";

interface INames {
  target: string,
  id: number
}

export default function Names({target, id}: INames) {
  //console.log("Target: ", target)
  const selector = useSelector((state: RootState) => state[target][target])
  //console.log("Selector: ", selector)
  const name = selector[id - 1].name
  return(
    <React.Fragment>
      {name}
    </React.Fragment>
  )
}