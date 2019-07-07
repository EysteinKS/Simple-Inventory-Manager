import { updateProductAmount, saveProducts } from "./productsActions"
import { getSectionFromFirestore, setSectionToFirestore, convertTimestampsToDates } from "../middleware/thunks"
import { ISale, IOrderedProduct, SalesState } from "../types";
import { IThunkAction } from "../middleware/types";

const thisSection = "sales"

//LOADING

export const LOAD_SALES_BEGIN = 'LOAD_SALES_BEGIN'
export const loadSalesBegin = () => ({
  type: LOAD_SALES_BEGIN,
})

export const LOAD_SALES_SUCCESS = 'LOAD_SALES_SUCCESS'
type TLoadSalesSuccess = {
  sales: ISale[],
  history: ISale[],
  currentID: number
}
export const loadSalesSuccess = ({ sales, history, currentID }: TLoadSalesSuccess) => ({
  type: LOAD_SALES_SUCCESS,
  payload: { sales, history, currentID }
})

export const LOAD_SALES_FAILURE = 'LOAD_SALES_FAILURE'
export const loadSalesFailure = (error: string) => ({
  type: LOAD_SALES_FAILURE,
  payload: error
})

export const loadSales = () =>
  getSectionFromFirestore(thisSection,
    loadSalesBegin,
    loadSalesSuccess,
    loadSalesFailure,
    (data) => {
      let sales = convertTimestampsToDates(data.sales, ["dateOrdered", "dateSent"])
      let history = convertTimestampsToDates(data.history, ["dateOrdered", "dateSent"])
      return {
        sales: sales,
        history: history,
        currentID: data.currentID
      }
    })

export const SAVE_SALES_BEGIN = 'SAVE_SALES_BEGIN'
export const saveSalesBegin = () => ({
  type: SAVE_SALES_BEGIN,
})

export const SAVE_SALES_SUCCESS = 'SAVE_SALES_SUCCESS'
export const saveSalesSuccess = () => ({
  type: SAVE_SALES_SUCCESS,
})

export const SAVE_SALES_FAILURE = 'SAVE_SALES_FAILURE'
export const saveSalesFailure = (error: string) => ({
  type: SAVE_SALES_FAILURE,
  payload: error
})

export const saveSales = () =>
  setSectionToFirestore(thisSection,
    saveSalesBegin,
    saveSalesSuccess,
    saveSalesFailure,
    (state) => {
      let s = state.sales as SalesState
      let sales = convertTimestampsToDates(s.sales, ["dateOrdered", "dateSent"])
      let history = convertTimestampsToDates(s.history, ["dateOrdered", "dateSent"])
      return {
        sales: sales,
        history: history,
        currentID: s.currentID
      }
    })

export const CREATE_SALE = 'CREATE_SALE'
export const createSale = (initializedSale: ISale) => ({
  type: CREATE_SALE,
  payload: initializedSale
})

export const SAVE_CREATED_SALE = 'SAVE_CREATED_SALE'
export const saveCreatedSale = (created: ISale) => ({
  type: SAVE_CREATED_SALE,
  payload: created
})

export const EDIT_SALE = 'EDIT_SALE'
export const editSale = (id: number) => ({
  type: EDIT_SALE,
  payload: id
})

export const SAVE_EDITED_SALE = 'SAVE_EDITED_SALE'
export const saveEditedSale = (sale: ISale) => ({
  type: SAVE_EDITED_SALE,
  payload: sale
})

export const CLEAR_CURRENT_SALE = 'CLEAR_CURRENT_SALE'
export const clearCurrentSale = () => ({
  type: CLEAR_CURRENT_SALE,
})

export const SEND_SALE = 'SEND_SALE'
export const sendSale = (id: number) => ({
  type: SEND_SALE,
  payload: id
})

export const didSendSale = (id: number, ordered: IOrderedProduct[]): IThunkAction => {
  return async (dispatch) => {
    ordered.forEach(product => {
      dispatch(updateProductAmount(product.productID, -Math.abs(product.amount)))
    })
    dispatch(sendSale(id))
    dispatch(saveProducts())
  }
}

export const DELETE_SALE = 'DELETE_SALE'
export const deleteSale = (id: number) => ({
  type: DELETE_SALE,
  payload: id
})

export const RESET_SALES = 'RESET_SALES'
export const resetSales = () => ({
  type: RESET_SALES
})
