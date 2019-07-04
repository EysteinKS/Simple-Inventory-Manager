import * as action from "../actions/authActions"
import { setLocalStorage, authKey } from "../middleware/localStorage"
import produce from "immer"

const initialState = {
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
  locationName: "",
  logoUrl: null,
  primaryColor: null,
  locations: [],
  settings: {
    language: "NO",
    isInactiveVisible: true
  },
  lastChanged: {
    global: new Date("2019-07-01T19:45:00"),
    sections: {
      categories: new Date("2019-07-01T19:45:00"),
      customers: new Date("2019-07-01T19:45:00"),
      orders: new Date("2019-07-01T19:45:00"),
      sales: new Date("2019-07-01T19:45:00"),
      suppliers: new Date("2019-07-01T19:45:00")
    }
  },
  loggingOut: false
}

export default (state = initialState, {type, payload}) => 
  produce(state, draft => {
    switch(type){
      case action.USER_SIGNED_OUT:
        draft.loggingOut = false
        break
      case action.USER_LOGGING_IN:
      case action.LOAD_USER_BEGIN:
        draft.isLoading = true
        draft.isLoaded = false
        draft.loadingError = null
        break
      case action.LOAD_USER_SUCCESS:
        let newDraft = { ...draft, ...payload }
        newDraft.isLoading = false
        newDraft.isLoaded = true
        return newDraft
      case action.LOAD_USER_FAILURE:
        draft.isLoading = false
        draft.isLoaded = true
        draft.loadingError = payload
        break
      case action.SET_LOCATION_NAME:
        draft.locationName = payload
        break
      case action.SET_LOCATION_LOGO:
        draft.logoUrl = payload
        break
      case action.SET_LOCATION_COLOR:
        draft.primaryColor = payload
        break
      case action.SET_ALL_LAST_CHANGED:
        draft.lastChanged = payload
        break
      case action.SET_LAST_CHANGED: 
        draft.lastChanged.global = payload.date
        draft.lastChanged.sections[payload.section] = payload.date
        break
      case action.RESET_AUTH:
        let resetDraft = { ...initialState, loggingOut: true }
        setLocalStorage(authKey, resetDraft)
        return resetDraft
      default:
        return state
    }
  })
