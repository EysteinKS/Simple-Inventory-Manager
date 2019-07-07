import store from "store"
import { RootState } from "../types"

interface IStringKeys {
  [index: string]: string
}

export interface ISectionKeys extends IStringKeys {
  categories: string,
  customers: string,
  orders: string,
  products: string,
  sales: string,
  suppliers: string
}

export interface ICombinedKeys extends ISectionKeys {
  auth: string
}

export const authKey = "auth"
export const sectionKeys: ISectionKeys = {
  categories: "categories",
  customers: "customers",
  orders: "orders",
  products: "products",
  sales: "sales",
  suppliers: "suppliers"
}
export const combinedKeys: ICombinedKeys = {
  ...sectionKeys,
  auth: authKey
}

export const getLocalStorage = (key = "") => {
  return store.get(key)
}

export const getAllStorage = () => {
  let allStorage = {}
  for(let k in combinedKeys) {
    let keyContent = getLocalStorage(k)
    if(keyContent == null) { return false }
    allStorage = {...allStorage, [k]: keyContent}
  }
  return allStorage
}

export const setLocalStorage = (key = "", value = {}) => {
  store.set(key, value)
}

export const clearLocalStorage = () => {
  console.log("Clearing localStorage")
  store.clearAll()
}