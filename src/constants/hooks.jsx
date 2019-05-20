import {useState, useEffect} from "react"

const AND = (list, cb) => list.every(cb)
const OR = (list, cb) => list.some(cb)

const gate = (arr, gate, cb) => {
  return (gate === "AND" ? AND(arr, cb) : OR(arr, cb))
}

export const useGate = (arr, gateType, source = undefined, value = true) => {
  const [bool, setBool] = useState(false)

  useEffect(() => {
    setBool(gate(arr, gateType, (val => val === value)))
    //console.log(`Checking useGate source ${source} with arr: `, arr)
  }, [arr, gateType, source, value])

  return bool
}


export const useEditableList = (arr = []) => {
  const [list, setList] = useState(arr)

  useEffect(() => {
    setList(arr)
  }, [arr])

  const add = (newListItem) => {
    setList(state => state.concat(newListItem))
  }

  const edit = (updated, index) => {
    let editedList = [...list]
    editedList[index] = updated
    setList(editedList)
  }

  const remove = (index) => {
    let withRemoved = [...list]
    withRemoved.splice(index, 1)
    setList(withRemoved)
  }

  const replace = setList

  return [list, add, edit, remove, replace]
}