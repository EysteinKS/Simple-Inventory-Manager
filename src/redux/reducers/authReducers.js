import * as action from "../actions/authActions"
import produce from "immer"

const initialState = {
  isLoggedIn: true,
  uid: null,
  firstName: "",
  lastName: "",
  role: "user",
  isLoading: false,
  isLoaded: false,
  loadingError: null,
  isSaving: false,
  isSaved: true,
  savingError: null,
  currentLocation: null,
  firebaseConfig: {
    apiKey: null,
    authDomain: null,
    databaseURL: null,
    projectId: null,
    storageBucket: null,
    messagingSenderId: null
  },
  locations: [],
  settings: {
    language: "NO",
    isInactiveVisible: true
  }
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    default:
      return state
  }
}