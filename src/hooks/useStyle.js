import {useState, useEffect} from "react"
import produce from "immer"


const initialStyle = {

  height: "100%",
  width: "100%"
}

const useStyle = (initial = {initialStyle}) => {
  const [style, setStyle] = useState(initial)
  let add = (newStyle) => new Promise(res => {
    setStyle(style => produce(style, draft => {
      draft.push(newStyle)
    }))
    res()
  })
  let remove = () => {}

  /*useEffect(() => {
    newStyle = {}
    styleArray.forEach(s => {
      let {key, content} = s

    })
    setStyle(newStyle)
  }, [styleArray])*/

  return [style, add, remove]
}



export default useStyle