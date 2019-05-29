import {useState, useEffect} from "react"
import {useSelector} from "react-redux"
import produce from "immer"

const AND = (list, cb) => list.every(cb)
const OR = (list, cb) => list.some(cb)

const gate = (arr, gate, cb) => {
  return (gate === "AND" ? AND(arr, cb) : OR(arr, cb))
}

export const useGate = (arr, gateType, source = undefined, initialValue = false, value = true) => {
  const [bool, setBool] = useState(initialValue)

  useEffect(() => {
    setBool(gate(arr, gateType, (val => val === value)))
    //console.log(`Checking useGate source ${source} with arr: `, arr)
  }, [arr, gateType, source, value])

  return bool
}

//Checks if target is sorted, goes through all stored sorting functions if sorted
export const useSortableList = (arr = [], target) => {
  const [list, setList] = useState(arr)
  const isSorted = useSelector(state => state[target].isSorted)
  const sortingFuncs = useSelector(state => state[target].sorting)

  useEffect(() => {
    if(isSorted){
      let newList = produce(list, draft => {
        if(Array.isArray(sortingFuncs)){
          sortingFuncs.forEach(sort => {
            if(typeof sort === "function"){
              draft.sort(sort)
            }
          })
        }
      })
      setList(newList)
    }
  }, [list, isSorted, sortingFuncs])

  return [list, setList]
}

export const useFilterableList = (arr = [], filter, isFiltered) => {
  const [list, setList] = useState(arr)

  return [list, setList]
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