export const LOAD_CATEGORIES_BEGIN = 'LOAD_CATEGORIES_BEGIN'
export const loadCategoriesBegin = () => ({
  type: LOAD_CATEGORIES_BEGIN,
})

export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS'
export const loadCategoriesSuccess = () => ({
  type: LOAD_CATEGORIES_SUCCESS,
})

export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE'
export const loadCategoriesFailure = (error) => ({
  type: LOAD_CATEGORIES_FAILURE,
  payload: error
})

export const loadCategories = () => {
  return dispatch => {
    
  }
}

export const SAVE_CREATED_CATEGORY = 'SAVE_CREATED_CATEGORY'
export const saveCreatedCategory = (name) => ({
  type: SAVE_CREATED_CATEGORY,
  payload: name
})
