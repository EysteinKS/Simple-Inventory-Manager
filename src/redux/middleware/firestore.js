import { getAllStorage, authKey, sectionKeys, setLocalStorage } from "./localStorage"
import { fsActions, lsBeginActions, lsSuccessActions } from "../actions"

export const sections = {
  categories: "Categories",
  customers: "Customers",
  orders: "Orders",
  products: "Products",
  sales: "Sales",
  suppliers: "Suppliers"
}

export const getInventory = () => {
  return (dispatch, getState) => {
    let state = getState()
    let fsLastChanged = state.auth.lastChanged
    let ls = getAllStorage()
    let lsLastChanged = ls ? ls.auth.lastChanged : false

    //console.log("localStorage data: ", ls)
    //If no localstorage data
    if(!ls) {
      getAllFromFirestore(dispatch)
      setLocalStorage(authKey, {lastChanged: fsLastChanged})
      return
    }

    let localStorageToTimeString = new Date(lsLastChanged.global).toString()
    //console.log(localStorageToTimeString)
    let firestoreToTimeString = fsLastChanged.global.toString()  
    //console.log(firestoreToTimeString)
    //console.log("ls === fs: ", firestoreToTimeString === localStorageToTimeString)
    if(firestoreToTimeString === localStorageToTimeString){
      return getAllFromLocalStorage(sectionKeys, dispatch, ls)
    }

    //Check which values are changed
    let isChanged = []
    let isUnchanged = []
    for(let k in fsLastChanged.sections){
      let fsDateToString = fsLastChanged.sections[k].toString()
      let lsDateToString = new Date(lsLastChanged.sections[k]).toString()

      if(fsDateToString === lsDateToString){
        isUnchanged.push(k)
      } else {
        isChanged.push(k)
      }
    }

    if(isChanged.length && isChanged.length === Object.keys(fsActions).length){
      getAllFromFirestore(dispatch)
      setLocalStorage(authKey, {lastChanged: fsLastChanged})
      return
    }

    if(isUnchanged.length){
      isUnchanged.forEach(k => {
        console.log(`Loading ${k} from localStorage...`)
        localDataFromKey(k, dispatch, ls)
      })
    }
    if(isChanged.length){
      isChanged.forEach(k => {
        console.log(`Loading ${k} from firestore...`)
        firestoreDataFromKey(k, dispatch)
      })
    }
    //console.log("fsLastChanged: ", fsLastChanged)
    setLocalStorage(authKey, {lastChanged: fsLastChanged})
  }
}

const firestoreDataFromKey = (key, dispatch) => {
  let load = fsActions[key]
  dispatch(load())
}

const localDataFromKey = (key, dispatch, localStorage) => {
  let begin = lsBeginActions[key]
  dispatch(begin())
  let dataFromLocalStorage = localStorage[key]
  let success = lsSuccessActions[key]
  //console.log("dataFromLocalStorage: ", dataFromLocalStorage)
  dispatch(success(dataFromLocalStorage))
}

const getAllFromLocalStorage = (keys, dispatch, localStorage) => {
  console.log("Getting all data from localStorage")
  Object.keys(keys).forEach(k => {
    localDataFromKey(k, dispatch, localStorage)
  })
}

const getAllFromFirestore = (dispatch) => {
  console.log("Getting all data from firestore")
  for(let func in fsActions) {
    dispatch(fsActions[func]())
  }
}