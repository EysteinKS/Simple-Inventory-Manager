import {useState, useEffect} from "react"

export default function useEditableList(arr = []) {
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