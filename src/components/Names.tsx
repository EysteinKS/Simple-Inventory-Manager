import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/types";

interface INames {
  target: string,
  id: number
}

export default function Names({target, id}: INames) {
  //console.log("Id: ", id)
  //console.log("Target: ", target)
  const selector = useSelector((state: RootState) => state[target][target])
  //console.log("Selector: ", selector[id - 1])
  let name: string = ""
  try {
    name = selector[id - 1].name
  } catch(err) {
    console.log(err.message)
    name = "ERROR"
  }
  return(
    <React.Fragment>
      {name}
    </React.Fragment>
  )
}