import {useState, useEffect} from "react"

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

const checkValue = (key, obj, value) => {
  return(((key in obj && typeof obj[key] === typeof value) ? obj[key] : false) === value)
}

export const generateSelectors = (arr, key, sel) => {
  return arr.map(i => {
    let ret = sel(s => s[i][key])
    return {[key]: ret}
  })
}

export const useGate = (objects = {gate: "AND", list: []}, keys = {gate: "AND", list: []}, value = true) => {
  const [bool, setBool] = useState(false)

  /*const checkValue = useCallback((key, obj) => {
    //Checks for values in object, returns false if value isn't in object or value isn't boolean
    //console.log("checkValue = ", {key, ...obj})
    return (((key in obj && typeof obj[key] === typeof value) ? obj[key] : false) === value)
  }, [value])*/

  useEffect(() => {
    setBool(
      gate(objects, 
        (obj => gate(keys, 
          (key => checkValue(key, obj, value))
          )
        )
      )
    )
  }, [objects, keys, value])

  //console.log(`Checking ${keys.list}, value is ${bool} and input is: `, objects.list)
  return bool
}

//Take an array of objects, keys and selectors
//Return a boolean value and a function for changing selectors