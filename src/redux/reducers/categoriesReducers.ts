/* eslint-disable default-case */
import * as action from "../actions/categoriesActions";
import produce from "immer";
import drafts from "./drafts";
import { AnyAction } from "redux";
import { CategoriesState } from "../types";

const initialState = drafts.initializeState({
  categories: []
}) as CategoriesState;

export default (state = initialState, { type, payload }: AnyAction) =>
  produce(state, draft => {
    switch (type) {
      case action.LOAD_CATEGORIES_BEGIN:
        return drafts.loadBegin(draft);

      case action.LOAD_CATEGORIES_SUCCESS:
        return drafts.loadSuccess(draft, "categories", payload);

      case action.LOAD_CATEGORIES_FAILURE:
        return drafts.loadFailure(draft, payload);

      case action.SAVE_CATEGORIES_BEGIN:
        return drafts.saveBegin(draft);

      case action.SAVE_CATEGORIES_SUCCESS:
        return drafts.saveSuccess(draft);

      case action.SAVE_CATEGORIES_FAILURE:
        return drafts.saveFailure(draft, payload);

      case action.SAVE_CREATED_CATEGORY:
        draft.categories.push({
          categoryID: draft.categories.length + 1,
          name: payload
        });
        draft.isSaved = false;
        return draft;
        
      case action.RESET_CATEGORIES:
        return drafts.resetReducer(initialState);
    }
  });
