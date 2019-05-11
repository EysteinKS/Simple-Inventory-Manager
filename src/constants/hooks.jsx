import React, {useState, useEffect, useCallback} from "react"
import {useSelector} from "react-redux"

export const gateTypes = {
  "AND": "AND",
  "OR": "OR"
}

const AND = (container, cb) => {
  //console.log("Container at AND: ", container)
  return container.list.every(cb)
}

const OR = (container, cb) => {
  //console.log("Container at OR: ", container)
  return container.list.some(cb)
}

const gate = (obj, cb) => {
  //console.log("Generating gate ", obj.gate)
  return (obj.gate === "AND" ? AND(obj, cb) : OR(obj, cb))
}

export const generateSelectors = (arr, key, sel) => {
  return arr.map(i => {
    let ret = sel(s => React.useCallback(() => s[i][key], [s]))
    return {[key]: ret}
  })
}

export const useGate = (objects = {gate: "AND", list: []}, keys = {gate: "AND", list: []}, value = true) => {
  const [bool, setBool] = useState(false)

  const checkValue = useCallback((key, obj) => {
    //Checks for values in object, returns false if value isn't in object or value isn't boolean
    //console.log("checkValue = ", {key, ...obj})
    return (((key in obj && typeof obj[key] === typeof value) ? obj[key] : false) === value)
  }, [value])

  const memoizedObjects = React.useMemo(() => objects, [objects])

  useEffect(() => {
    console.log("Checking ", keys.list)
    setBool(
      gate(memoizedObjects, 
        (obj => gate(keys, 
          (key => checkValue(key, obj))
          )
        )
      )
    )
  }, [memoizedObjects, keys, checkValue])

  //console.log(`Result of gating ${keys.list[0]}: `, bool)
  return bool
}

//Take an array of objects, keys and selectors
//Return a boolean value and a function for changing selectors

export const Example = (props) => {
  const objects = useSelector(state => {
      return[
        state.products,
        state.categories,
        state.orders,
        state.sales
      ]
    })
  const gateProps = [
    [{gate: gateTypes.OR, list: objects}, {gate: gateTypes.OR, list: ["isSaving"]}],
    [{gate: ""}]
  ]
  const isSaving = useGate("one", objects, "isSaving", true)
  const isUnsaved = useGate("one", objects, "isSaved", false)
  const allSaved = useGate("all", objects, "isSaved", true)
  const allStuff = useGate(
    {gate: gateTypes.AND, list: objects},
    {gate: gateTypes.AND, list: ["isActive"]},
    true
  )

  return(
    <div>
      {  (allSaved && <p>Alt er lagret</p>) 
      || (isUnsaved && <p>Noe er ulagret</p>)
      || (isSaving && <p>Lagrer...</p>)}
    </div>
  )
}