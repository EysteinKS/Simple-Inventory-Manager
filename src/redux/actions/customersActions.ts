import { getSectionFromFirestore, setSectionToFirestore } from "../middleware/thunks"
import { ICustomer } from "../types";

const thisSection = "customers"

export const LOAD_CUSTOMERS_BEGIN = 'LOAD_CUSTOMERS_BEGIN'
export const loadCustomersBegin = () => ({
  type: LOAD_CUSTOMERS_BEGIN,
})

export const LOAD_CUSTOMERS_SUCCESS = 'LOAD_CUSTOMERS_SUCCESS'
export const loadCustomersSuccess = ({ customers, currentID }: { customers: ICustomer[], currentID: number }) => ({
  type: LOAD_CUSTOMERS_SUCCESS,
  payload: { customers, currentID }
})

export const LOAD_CUSTOMERS_FAILURE = 'LOAD_CUSTOMERS_FAILURE'
export const loadCustomersFailure = (error: string) => ({
  type: LOAD_CUSTOMERS_FAILURE,
  payload: error
})

export const loadCustomers = () => 
  getSectionFromFirestore(thisSection,
    loadCustomersBegin,
    loadCustomersSuccess,
    loadCustomersFailure,
    (data) => {
      return {
        customers: data.customers,
        currentID: data.currentID
      }
    })

/* export const oldLoadCustomers = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(loadCustomersBegin())
    firestore.doc(`${state.auth.currentLocation}/Customers`).get()
      .then(res => {
        let data = res.data()
        let customers = data.customers
        let currentID = data.currentID
        console.log("Loaded customers successfully")
        dispatch(loadCustomersSuccess(customers, currentID))
      })
      .catch(err => loadCustomersFailure(err))
  }
} */

//SAVING

export const SAVE_CUSTOMERS_BEGIN = 'SAVE_CUSTOMERS_BEGIN'
export const saveCustomersBegin = () => ({
  type: SAVE_CUSTOMERS_BEGIN,
})

export const SAVE_CUSTOMERS_SUCCESS = 'SAVE_CUSTOMERS_SUCCESS'
export const saveCustomersSuccess = () => ({
  type: SAVE_CUSTOMERS_SUCCESS,
})

export const SAVE_CUSTOMERS_FAILURE = 'SAVE_CUSTOMERS_FAILURE'
export const saveCustomersFailure = (error: string) => ({
  type: SAVE_CUSTOMERS_FAILURE,
  payload: error
})

export const saveCustomers = () => 
  setSectionToFirestore(thisSection,
    saveCustomersBegin,
    saveCustomersSuccess,
    saveCustomersFailure,
    (state) => {
      return {
        customers: state.customers.customers,
        currentID: state.customers.currentID
      }
    })

/* export const oldSaveCustomers = (customers) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveCustomersBegin())
    firestore.doc(`${state.auth.currentLocation}/Customers`).set({
      customers: state.customers.customers,
      currentID: state.customers.currentID
    }, {merge: true})
      .then(() => {
        dispatch(saveCustomersSuccess())
        dispatch(saveLastChanged("customers"))
      })
      .catch(err => dispatch(saveCustomersFailure(err)))
  }
} */

export const SAVE_CREATED_CUSTOMER = 'SAVE_CREATED_CUSTOMER'
export const saveCreatedCustomer = (name: string) => ({
  type: SAVE_CREATED_CUSTOMER,
  payload: name
})

export const RESET_CUSTOMERS = 'RESET_CUSTOMERS'
export const resetCustomers = () => ({
  type: RESET_CUSTOMERS
})