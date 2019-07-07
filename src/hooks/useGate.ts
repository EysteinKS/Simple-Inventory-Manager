import {useState, useEffect} from "react"

type TCallback = (val: boolean) => boolean

const AND = (list: any[], cb: TCallback): boolean => list.every(cb)
const OR = (list: any[], cb: TCallback): boolean => list.some(cb)

const gate = (arr: any[], gate: string, cb: TCallback) => {
  if(gate === "AND") {
    return AND(arr, cb)
  } else {
    return OR(arr, cb)
  }
}

export default function useGate(arr: any[], gateType: string, initialValue = false, value = true) {
  const [bool, setBool] = useState(initialValue)

  useEffect(() => {
    setBool(gate(arr, gateType, ((val: boolean) => val === value)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr])

  return bool
}