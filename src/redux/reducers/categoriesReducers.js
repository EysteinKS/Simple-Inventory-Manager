import { productCategories } from "../../constants/mock"
import * as action from "../actions/categoriesActions"

const initialState = {
  categories: productCategories
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    case action.LOAD_CATEGORIES_BEGIN:
      return state
    case action.LOAD_CATEGORIES_SUCCESS:
      return state
    case action.LOAD_CATEGORIES_FAILURE:
      return state
    case action.SAVE_CREATED_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, {
          categoryID: state.categories.length + 1,
          name: payload
        }]
      }
    default:
      return state
  }
}