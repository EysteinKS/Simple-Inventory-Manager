import {useState, useEffect} from "react"

const AND = (list, cb) => list.every(cb)
const OR = (list, cb) => list.some(cb)

const gate = (arr, gate, cb) => {
  if(gate === "AND") {
    return AND(arr, cb)
  } else if(gate === "OR") {
    return OR(arr, cb)
  }
}

export default function useGate(arr, gateType, initialValue = false, value = true) {
  const [bool, setBool] = useState(initialValue)

  useEffect(() => {
    setBool(gate(arr, gateType, (val => val === value)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr])

  return bool
}