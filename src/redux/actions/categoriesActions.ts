import { getSectionFromFirestore, setSectionToFirestore } from "../middleware/thunks"
import { ICategory } from "../types"

const thisSection = "categories"

export const LOAD_CATEGORIES_BEGIN = 'LOAD_CATEGORIES_BEGIN'
export const loadCategoriesBegin = () => ({
  type: LOAD_CATEGORIES_BEGIN,
})

export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS'
export const loadCategoriesSuccess = ({ categories, currentID }: { categories: ICategory[], currentID: number}) => {
  return {
  type: LOAD_CATEGORIES_SUCCESS,
  payload: { categories, currentID }
}}

export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE'
export const loadCategoriesFailure = (error: string) => ({
  type: LOAD_CATEGORIES_FAILURE,
  payload: error
})

export const loadCategories = () => 
  getSectionFromFirestore(thisSection, 
    loadCategoriesBegin,
    loadCategoriesSuccess,
    loadCategoriesFailure,
    (data) => { 
      return { 
        categories: data.categories,
        currentID: data.currentID
      } 
    })

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
export const saveCategoriesFailure = (error: string) => ({
  type: SAVE_CATEGORIES_FAILURE,
  payload: error
})

export const saveCategories = (date: Date) => 
  setSectionToFirestore(
    date,
    thisSection,
    saveCategoriesBegin,
    saveCategoriesSuccess,
    saveCategoriesFailure,
    (state) => {
      return {
        categories: state.categories.categories,
        currentID: state.categories.currentID
      }
    })

/* export const saveCategories = (categories) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveCategoriesBegin())
    firestore.doc(`${state.auth.currentLocation}/Categories`).set({
      categories
    }, {merge: true})
      .then(() => {
        dispatch(saveCategoriesSuccess())
        dispatch(saveLastChanged("categories"))
      })
      .catch(err => dispatch(saveCategoriesFailure(err)))
  }
} */

export const SAVE_CREATED_CATEGORY = 'SAVE_CREATED_CATEGORY'
export const saveCreatedCategory = (name: string) => ({
  type: SAVE_CREATED_CATEGORY,
  payload: name
})

export const RESET_CATEGORIES = 'RESET_CATEGORIES'
export const resetCategories = () => ({
  type: RESET_CATEGORIES
})