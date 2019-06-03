import { firestore } from "../../firebase/firebase"

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
        console.log(data)
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
