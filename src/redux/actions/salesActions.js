import { firestore } from "../../firebase/firebase"

//LOADING

export const LOAD_SALES_BEGIN = 'LOAD_SALES_BEGIN'
export const loadSalesBegin = () => ({
  type: LOAD_SALES_BEGIN,
})

export const LOAD_SALES_SUCCESS = 'LOAD_SALES_SUCCESS'
export const loadSalesSuccess = (sales) => ({
  type: LOAD_SALES_SUCCESS,
  payload: sales
})

export const LOAD_SALES_FAILURE = 'LOAD_SALES_FAILURE'
export const loadSalesFailure = (error) => ({
  type: LOAD_SALES_FAILURE,
  payload: error
})

export const loadSales = () => {
  return dispatch => {
    dispatch(loadSalesBegin())
    firestore.doc("Barcontrol/Sales")
      .then(res => {
        let sales = res.data().sales
        console.log("Loaded sales successfully")
        dispatch(loadSalesSuccess(sales))
      })
      .catch(err => dispatch(loadSalesFailure(err)))
  }
}

//SAVING

export const SAVE_SALES_BEGIN = 'SAVE_SALES_BEGIN'
export const saveSalesBegin = () => ({
  type: SAVE_SALES_BEGIN,
})

export const SAVE_SALES_SUCCESS = 'SAVE_SALES_SUCCESS'
export const saveSalesSuccess = () => ({
  type: SAVE_SALES_SUCCESS,
})

export const SAVE_SALES_FAILURE = 'SAVE_SALES_FAILURE'
export const saveSalesFailure = (error) => ({
  type: SAVE_SALES_FAILURE,
  payload: error
})

export const saveSales = (sales) => {
  return dispatch => {
    dispatch(saveSalesBegin())
    firestore.doc("Barcontrol/Sales").set({
      sales: sales
    }, {merge: true})
      .then(() => {
        dispatch(saveSalesSuccess())
      })
      .catch(err => dispatch(saveSalesFailure(err)))
  }
}

//SALE HANDLING

export const CREATE_SALE = 'CREATE_SALE'
export const createSale = (initializedSale) => ({
  type: CREATE_SALE,
  payload: initializedSale
})

export const SAVE_CREATED_SALE = 'SAVE_CREATED_SALE'
export const saveCreatedSale = (created) => ({
  type: SAVE_CREATED_SALE,
  payload: created
})

export const EDIT_SALE = 'EDIT_SALE'
export const editSale = (id) => ({
  type: EDIT_SALE,
  payload: id
})

export const SAVE_EDITED_SALE = 'SAVE_EDITED_SALE'
export const saveEditedSale = (edited) => ({
  type: SAVE_EDITED_SALE,
  payload: edited
})

export const CLEAR_CURRENT_SALE = 'CLEAR_CURRENT_SALE'
export const clearCurrentSale = () => ({
  type: CLEAR_CURRENT_SALE,
})

export const FINISH_SALE = 'FINISH_SALE'
export const finishSale = (id) => ({
  type: FINISH_SALE,
  payload: id
})
