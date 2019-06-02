import { secondaryFirestore as firestore } from "../../firebase/firebase"
import { updateProductAmount, saveProducts } from "./productsActions"

//LOADING

export const LOAD_SALES_BEGIN = 'LOAD_SALES_BEGIN'
export const loadSalesBegin = () => ({
  type: LOAD_SALES_BEGIN,
})

export const LOAD_SALES_SUCCESS = 'LOAD_SALES_SUCCESS'
export const loadSalesSuccess = (sales, history, currentID) => ({
  type: LOAD_SALES_SUCCESS,
  payload: {sales, history, currentID}
})

export const LOAD_SALES_FAILURE = 'LOAD_SALES_FAILURE'
export const loadSalesFailure = (error) => ({
  type: LOAD_SALES_FAILURE,
  payload: error
})

export const loadSales = () => {
  return dispatch => {
    dispatch(loadSalesBegin())
    firestore.doc("Barcontrol/Sales").get()
      .then(res => {
        let data = res.data()
        let sales = data.sales.map(sale => {
          sale.dateOrdered = new Date(sale.dateOrdered.seconds * 1000)
          return sale
        })
        console.log("Loaded sales successfully")
        dispatch(loadSalesSuccess(sales, data.history, data.currentID))
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

export const saveSales = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveSalesBegin())
    firestore.doc("Barcontrol/Sales").set({
      sales: state.sales.sales,
      history: state.sales.history,
      currentID: state.sales.currentID
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
export const saveEditedSale = (sale) => ({
  type: SAVE_EDITED_SALE,
  payload: sale
})

export const CLEAR_CURRENT_SALE = 'CLEAR_CURRENT_SALE'
export const clearCurrentSale = () => ({
  type: CLEAR_CURRENT_SALE,
})

export const SEND_SALE = 'SEND_SALE'
export const sendSale = (id) => ({
  type: SEND_SALE,
  payload: id
})

export const didSendSale = (id, ordered) => {
  return (dispatch, getState) => {
    ordered.forEach(product => {
      dispatch(updateProductAmount(product.productID, -Math.abs(product.amount)))
    })
    dispatch(sendSale(id))
    const state = getState()
    dispatch(saveProducts(state.products.products))
  }
}

export const DELETE_SALE = 'DELETE_SALE'
export const deleteSale = (id) => ({
  type: DELETE_SALE,
  payload: id
})
