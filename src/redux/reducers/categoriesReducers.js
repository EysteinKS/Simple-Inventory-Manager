/* eslint-disable default-case */
import * as action from "../actions/categoriesActions";
import produce from "immer";
import drafts from "./drafts"

/* const initialState = {
  categories: [],
  isLoading: false,
  isLoaded: false,
  loadingError: false,
  isSaving: false,
  isSaved: true,
  savingError: false,
  error: null
}; */

export default (state = drafts.initializeState({categories: []}), { type, payload }) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_CATEGORIES_BEGIN:
        return drafts.loadBegin(draft)
      case action.LOAD_CATEGORIES_SUCCESS:
        return drafts.loadSuccess(draft, "categories", payload)
      case action.LOAD_CATEGORIES_FAILURE:
        return drafts.loadFailure(draft, payload)
      case action.SAVE_CATEGORIES_BEGIN:
        return drafts.saveBegin(draft)
      case action.SAVE_CATEGORIES_SUCCESS:
        return drafts.saveSuccess(draft)
      case action.SAVE_CATEGORIES_FAILURE:
        return drafts.saveFailure(draft, payload)
      case action.SAVE_CREATED_CATEGORY:
        draft.categories.push({
          categoryID: draft.categories.length + 1,
          name: payload
        })
        break
    }
});
