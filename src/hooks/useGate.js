import {useState, useEffect, useMemo} from "react"

const AND = (list, cb) => list.every(cb)
const OR = (list, cb) => list.some(cb)

const gate = (arr, gate, cb) => {
  return (gate === "AND" ? AND(arr, cb) : OR(arr, cb))
}

export default function useGate(arr, gateType, source = undefined, initialValue = false, value = true) {
  const [bool, setBool] = useState(initialValue)


  useEffect(() => {
    setBool(gate(arr, gateType, (val => val === value)))
    //console.log(`Checking useGate source ${source} with arr: `, arr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr])

  return bool
}


/*
USED IN:

App.js
Products.js
Orders.js
Sales.js

*/