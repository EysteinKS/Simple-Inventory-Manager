import store from "store"

export const authKey = "auth"
export const sectionKeys = {
  categories: "categories",
  customers: "customers",
  orders: "orders",
  products: "products",
  sales: "sales",
  suppliers: "suppliers"
}
export const combinedKeys = {
  ...sectionKeys,
  auth: authKey
}

const isValidKey = (key, keys) => {
  if(typeof key !== "string" || !(key in keys)){
    throw new Error(`Key ${key} is invalid!`)
  } else {
    return key
  }
}

export const getLocalStorage = (key = "") => {
  let validKey = isValidKey(key, combinedKeys)
  //console.log(`Get ${key} from localStorage: `, store.get(validKey))
  return store.get(validKey)
}

export const getAllStorage = () => {
  //console.log("Fetching data from localStorage")
  let allStorage = {}
  for(let k in combinedKeys) {
    let keyContent = getLocalStorage(k)
    if(keyContent == null) { return false }
    allStorage = {...allStorage, [k]: keyContent}
  }
  //console.log("allStorage: ", allStorage)
  return allStorage
}

export const setLocalStorage = (key = "", value = {}) => {
  //console.log(`Setting new value to ${key} in localStorage`)
  let validKey = isValidKey(key, combinedKeys)
  //console.log(`Value being set to ${validKey}: `, value)
  store.set(validKey, value)
}

export const clearLocalStorage = () => {
  console.log("Clearing localStorage")
  store.clearAll()
}