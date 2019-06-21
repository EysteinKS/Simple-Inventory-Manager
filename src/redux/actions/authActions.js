import { firestore } from "../../firebase/firebase"

export const USER_SIGNING_IN = 'USER_SIGNING_IN'
export const userSigningIn = () => ({
  type: USER_SIGNING_IN,
})


export const LOAD_USER_BEGIN = 'LOAD_USER_BEGIN'
export const loadUserBegin = () => ({
  type: LOAD_USER_BEGIN
})

export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS'
export const loadUserSuccess = (payload) => ({
  type: LOAD_USER_SUCCESS,
  payload: payload
})

export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE'
export const loadUserFailure = (error) => ({
  type: LOAD_USER_FAILURE,
  payload: error
})

export const loadUser = (uid) => {
  return dispatch => {
    dispatch(loadUserBegin())
    firestore.doc(`Users/${uid}`).get()
      .then(res => {
        let data = res.data()
        //console.log(data)
        dispatch(loadUserSuccess(data))
      })
      .catch(err => dispatch(loadUserFailure(err.message)))
  }
}

export const SET_LOCATION_NAME = 'SET_LOCATION_NAME'
export const setLocationName = (name) => ({
  type: SET_LOCATION_NAME,
  payload: name
})

export const SET_LOCATION_LOGO = 'SET_LOCATION_LOGO'
export const setLocationLogo = (url) => ({
  type: SET_LOCATION_LOGO,
  payload: url
})

export const SET_LOCATION_COLOR = 'SET_LOCATION_COLOR'
export const setLocationColor = (hex) => ({
  type: SET_LOCATION_COLOR,
  payload: hex
})

export const RESET_AUTH = 'RESET_AUTH'
export const resetAuth = () => ({
  type: RESET_AUTH
})