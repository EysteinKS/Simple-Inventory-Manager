import { secondaryFirestore as firestore } from "../../firebase/firebase"

export const LOAD_CATEGORIES_BEGIN = 'LOAD_CATEGORIES_BEGIN'
export const loadCategoriesBegin = () => ({
  type: LOAD_CATEGORIES_BEGIN,
})

export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS'
export const loadCategoriesSuccess = (categories = []) => ({
  type: LOAD_CATEGORIES_SUCCESS,
  payload: categories
})

export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE'
export const loadCategoriesFailure = (error) => ({
  type: LOAD_CATEGORIES_FAILURE,
  payload: error
})

export const loadCategories = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(loadCategoriesBegin())
    firestore.doc(`${state.auth.currentLocation}/Categories`).get()
      .then(res => {
        let categories = res.data().categories
        console.log("Loaded categories successfully")
        dispatch(loadCategoriesSuccess(categories))
      })
      .catch(err => loadCategoriesFailure(err))
  }
}

//SAVING

export const SAVE_CATEGORIES_BEGIN = 'SAVE_CATEGORIES_BEGIN'
export const saveCategoriesBegin = () => ({
  type: SAVE_CATEGORIES_BEGIN,
})

export const SAVE_CATEGORIES_SUCCESS = 'SAVE_CATEGORIES_SUCCESS'
export const saveCategoriesSuccess = () => ({
  type: SAVE_CATEGORIES_SUCCESS,
})

export const SAVE_CATEGORIES_FAILURE = 'SAVE_CATEGORIES_FAILURE'
export const saveCategoriesFailure = (error) => ({
  type: SAVE_CATEGORIES_FAILURE,
  payload: error
})

export const saveCategories = (categories) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveCategoriesBegin())
    firestore.doc(`${state.auth.currentLocation}/Categories`).set({
      categories
    }, {merge: true})
      .then(() => {
        dispatch(saveCategoriesSuccess())
      })
      .catch(err => dispatch(saveCategoriesFailure(err)))
  }
}

export const SAVE_CREATED_CATEGORY = 'SAVE_CREATED_CATEGORY'
export const saveCreatedCategory = (name) => ({
  type: SAVE_CREATED_CATEGORY,
  payload: name
})

export const RESET_CATEGORIES = 'RESET_CATEGORIES'
export const resetCategories = () => ({
  type: RESET_CATEGORIES
})