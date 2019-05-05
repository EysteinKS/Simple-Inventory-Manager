import { productCategories } from "../../constants/mock"

const initialState = {
  categories: productCategories
}

export default (state = initialState, {type, payload}) => {
  switch(type){
    default:
      return state
  }
}