import * as action from "../actions/authActions"
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
  }
}

export default (state = initialState, {type, payload}) => 
  produce(state, draft => {
    switch(type){
      case action.LOAD_USER_BEGIN:
        draft.isLoading = true
        draft.isLoaded = false
        draft.loadingError = null
        break
      case action.LOAD_USER_SUCCESS:
        draft.isLoading = false
        draft.isLoaded = true
        draft.firstName = payload.firstName
        draft.lastName = payload.lastName
        draft.role = payload.role
        draft.currentLocation = payload.currentLocation
        draft.locations = payload.locations
        draft.settings.language = payload.settings.language
        draft.settings.isInactiveVisible = payload.settings.isInactiveVisible
        break
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
      default:
        return state
    }
  })
