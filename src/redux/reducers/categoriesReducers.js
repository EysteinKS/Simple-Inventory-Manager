/* eslint-disable default-case */
import * as action from "../actions/categoriesActions";
import produce from "immer";

const initialState = {
  categories: [],
  isLoading: false,
  isLoaded: false,
  loadingError: false,
  isSaving: false,
  isSaved: true,
  savingError: false,
  error: null
};

export default (state = initialState, { type, payload }) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_CATEGORIES_BEGIN:
        draft.isLoading = true
        draft.isLoaded = false
        draft.loadingError = false
        draft.error = null
        break
      case action.LOAD_CATEGORIES_SUCCESS:
        draft.isLoading = false
        draft.isLoaded = true
        draft.categories = payload
        break
      case action.LOAD_CATEGORIES_FAILURE:
        draft.categories = []
        draft.isLoading = false
        draft.isLoaded = false
        draft.loadingError = true
        draft.error = payload
        break
      case action.SAVE_CATEGORIES_BEGIN:
        draft.isSaving = true
        draft.isSaved = false
        draft.error = null
        break
      case action.SAVE_CATEGORIES_SUCCESS:
        draft.isSaving = false
        draft.isSaved = true
        break
      case action.SAVE_CATEGORIES_FAILURE:
        draft.isSaving = false
        draft.isSaved = false
        draft.savingError = true
        draft.error = payload
        break
      case action.SAVE_CREATED_CATEGORY:
        draft.categories.push({
          categoryID: draft.categories.length + 1,
          name: payload
        })
        break
    }
  });
