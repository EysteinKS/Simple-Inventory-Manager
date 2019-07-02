import { secondaryFirestore } from "../../firebase/firebase"
import { setLocalStorage } from "./localStorage"
import { saveLastChanged } from "../actions/authActions"
import { convertTimestampToDate } from "../../constants/util"

const firestoreSections = {
  categories: "Categories",
  customers: "Customers",
  orders: "Orders",
  products: "Products",
  sales: "Sales",
  suppliers: "Suppliers"
}

const getSectionString = (section) => {
  if(typeof section !== "string"){
    throw new Error(`getSectionString input is of type ${typeof section} but needs to be a string!`)
  }
  if(!firestoreSections[section]){
    throw new Error(`Unable to get section string for firestore, section ${section} is invalid!`)
  } else {
    return firestoreSections[section]
  }
}

const getCurrentLocation = (state) => {
  const location = state.auth.currentLocation
  if(!location || (typeof location !== "string")){
    throw new Error("Invalid data in auth currentLocation from Redux store!")
  }
  return location
}

export const getSectionFromFirestore = (section, onBegin, onSuccess, onFailure, handleResponse = null) => 
  (dispatch, getState) => {
    const state = getState()
    let location = getCurrentLocation(state)
    let sectionString = getSectionString(section)
    dispatch(onBegin())
    secondaryFirestore.doc(`${location}/${sectionString}`).get()
      .then(res => {
        let data = res.data()
        if(!handleResponse || (typeof handleResponse !== "function")){
          console.log(`Loaded ${section} successfully`)
          dispatch(onSuccess(data))
          setLocalStorage(section, data)
        } else if(typeof handleResponse === "function"){
          let handled = handleResponse(data)
          dispatch(onSuccess(handled))
          setLocalStorage(section, handled)
        }
      })
      .catch(err => dispatch(onFailure(err.message)))
  }

/**
 * @function
 * @param {Array} data - Array of data which contains keys provided
 * @param {Array} keys - Array of keys that contain timestamps
 * @returns {Array}
 */

export const convertTimestampsToDates = (data = [], keys = []) => {
  if(!data || !Array.isArray(data)){
    throw new Error("Invalid data in convertTimestampsToDates")
  }
  return data.map(part => {
    keys.forEach(key => {
      if(part[key] === "undefined"){
        throw new Error(`Key ${key} is undefined in ${part.name}`)
      }
      part[key] = convertTimestampToDate(part[key])
    })
    return part
  })
}

export const setSectionToFirestore = (section, onBegin, onSuccess, onFailure, saveFromState) => 
  (dispatch, getState) => {
    const state = getState()
    let location = getCurrentLocation(state)
    let sectionString = getSectionString(section)
    let dataToSave = saveFromState(state)
    dispatch(onBegin())
    secondaryFirestore.doc(`${location}/${sectionString}`).set(dataToSave, {merge:true})
      .then(() => {
        dispatch(onSuccess())
        dispatch(saveLastChanged(section))
        setLocalStorage(section, {...dataToSave})
      })
      .catch(err => dispatch(onFailure(err.message)))
  }