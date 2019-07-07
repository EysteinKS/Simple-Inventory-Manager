import { firestore } from "../../firebase/firebase"
import { setLocalStorage, authKey } from "../middleware/localStorage"
import { IThunkAction } from "../middleware/types";
import { LastChanged, UserState } from "../types";

export const USER_SIGNED_OUT = 'USER_SIGNED_OUT'
export const userSignedOut = () => ({
  type: USER_SIGNED_OUT,
})

export const USER_LOGGING_IN = 'USER_LOGGING_IN'
export const userLoggingIn = () => ({
  type: USER_LOGGING_IN,
})


export const LOAD_USER_BEGIN = 'LOAD_USER_BEGIN'
export const loadUserBegin = () => ({
  type: LOAD_USER_BEGIN
})

export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS'
export const loadUserSuccess = (payload: UserState) => ({
  type: LOAD_USER_SUCCESS,
  payload: payload 
})


export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE'
export const loadUserFailure = (error: string) => ({
  type: LOAD_USER_FAILURE,
  payload: error
})

export const loadUser = (uid: string): IThunkAction => {
  return async dispatch => {
    dispatch(loadUserBegin())
    firestore.doc(`Users/${uid}`).get()
      .then(res => {
        let data = res.data() as UserState
        //console.log(data)
        dispatch(loadUserSuccess(data))
      })
      .catch(err => dispatch(loadUserFailure(err.message)))
  }
}

export const SET_LOCATION_NAME = 'SET_LOCATION_NAME'
export const setLocationName = (name: string) => ({
  type: SET_LOCATION_NAME,
  payload: name
})

export const SET_LOCATION_LOGO = 'SET_LOCATION_LOGO'
export const setLocationLogo = (url: string | null) => ({
  type: SET_LOCATION_LOGO,
  payload: url
})

export const SET_LOCATION_COLOR = 'SET_LOCATION_COLOR'
export const setLocationColor = (hex: string | null) => ({
  type: SET_LOCATION_COLOR,
  payload: hex
})

export const SET_ALL_LAST_CHANGED = 'SET_ALL_LAST_CHANGED'
export const setAllLastChanged = (lastChanged: LastChanged) => ({
  type: SET_ALL_LAST_CHANGED,
  payload: lastChanged
})

export const SET_LAST_CHANGED = 'SET_LAST_CHANGED'
export const setLastChanged = (section: string, date: string | Date) => ({
  type: SET_LAST_CHANGED,
  payload: { section, date }
})

export const saveLastChanged = (section: string): IThunkAction => {
  return async (dispatch, getState) => {
    let state = getState()
    let dateChanged = new Date()
    firestore.doc(`Clients/${state.auth.currentLocation}`).update({
      "lastChanged.global": dateChanged,
      [`lastChanged.sections.${section}`]: dateChanged
    }).then(() => {
      dispatch(setLastChanged(section, dateChanged))
      let updatedAuthStorage = {
        ...state.auth, 
        lastChanged: {
          global: dateChanged,
           sections: {
             ...state.auth.lastChanged.sections, 
             [section]: dateChanged
            }
          }
        }
      setLocalStorage(authKey, updatedAuthStorage)
    }).catch(err => {console.log("error saving lastChanged: ", err.message)})
  }  
}


export const RESET_AUTH = 'RESET_AUTH'
export const resetAuth = () => ({
  type: RESET_AUTH
})