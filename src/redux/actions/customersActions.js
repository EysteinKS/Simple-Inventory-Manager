import { firestore } from "../../firebase/firebase"

export const LOAD_CUSTOMERS_BEGIN = 'LOAD_CUSTOMERS_BEGIN'
export const loadCustomersBegin = () => ({
  type: LOAD_CUSTOMERS_BEGIN,
})

export const LOAD_CUSTOMERS_SUCCESS = 'LOAD_CUSTOMERS_SUCCESS'
export const loadCustomersSuccess = (customers, currentID) => ({
  type: LOAD_CUSTOMERS_SUCCESS,
  payload: {customers, currentID}
})

export const LOAD_CUSTOMERS_FAILURE = 'LOAD_CUSTOMERS_FAILURE'
export const loadCustomersFailure = (error) => ({
  type: LOAD_CUSTOMERS_FAILURE,
  payload: error
})

export const loadCustomers = () => {
  return dispatch => {
    dispatch(loadCustomersBegin())
    firestore.doc("Barcontrol/Customers").get()
      .then(res => {
        let data = res.data()
        let customers = data.customers
        let currentID = data.currentID
        console.log("Loaded customers successfully")
        dispatch(loadCustomersSuccess(customers, currentID))
      })
      .catch(err => loadCustomersFailure(err))
  }
}

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
export const saveCustomersFailure = (error) => ({
  type: SAVE_CUSTOMERS_FAILURE,
  payload: error
})

export const saveCustomers = (customers) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveCustomersBegin())
    firestore.doc("Barcontrol/Customers").set({
      customers: state.customers.customers,
      currentID: state.customers.currentID
    }, {merge: true})
      .then(() => {
        dispatch(saveCustomersSuccess())
      })
      .catch(err => dispatch(saveCustomersFailure(err)))
  }
}

export const SAVE_CREATED_CUSTOMER = 'SAVE_CREATED_CUSTOMER'
export const saveCreatedCustomer = (name) => ({
  type: SAVE_CREATED_CUSTOMER,
  payload: name
})
