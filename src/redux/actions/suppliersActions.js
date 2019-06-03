import { secondaryFirestore as firestore } from "../../firebase/firebase"

export const LOAD_SUPPLIERS_BEGIN = 'LOAD_SUPPLIERS_BEGIN'
export const loadSuppliersBegin = () => ({
  type: LOAD_SUPPLIERS_BEGIN,
})

export const LOAD_SUPPLIERS_SUCCESS = 'LOAD_SUPPLIERS_SUCCESS'
export const loadSuppliersSuccess = (suppliers, currentID) => ({
  type: LOAD_SUPPLIERS_SUCCESS,
  payload: {suppliers, currentID}
})

export const LOAD_SUPPLIERS_FAILURE = 'LOAD_SUPPLIERS_FAILURE'
export const loadSuppliersFailure = (error) => ({
  type: LOAD_SUPPLIERS_FAILURE,
  payload: error
})

export const loadSuppliers = () => {
  return (dispatch, getState) => {
    const state = getState()    
    dispatch(loadSuppliersBegin())
    firestore.doc(`${state.auth.currentLocation}/Suppliers`).get()
      .then(res => {
        let data = res.data()
        let suppliers = data.suppliers
        let currentID = data.currentID
        console.log("Loaded suppliers successfully")
        dispatch(loadSuppliersSuccess(suppliers, currentID))
      })
      .catch(err => loadSuppliersFailure(err))
  }
}

//SAVING

export const SAVE_SUPPLIERS_BEGIN = 'SAVE_SUPPLIERS_BEGIN'
export const saveSuppliersBegin = () => ({
  type: SAVE_SUPPLIERS_BEGIN,
})

export const SAVE_SUPPLIERS_SUCCESS = 'SAVE_SUPPLIERS_SUCCESS'
export const saveSuppliersSuccess = () => ({
  type: SAVE_SUPPLIERS_SUCCESS,
})

export const SAVE_SUPPLIERS_FAILURE = 'SAVE_SUPPLIERS_FAILURE'
export const saveSuppliersFailure = (error) => ({
  type: SAVE_SUPPLIERS_FAILURE,
  payload: error
})

export const saveSuppliers = (suppliers) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(saveSuppliersBegin())
    firestore.doc(`${state.auth.currentLocation}/Suppliers`).set({
      suppliers: state.suppliers.suppliers,
      currentID: state.suppliers.currentID
    }, {merge: true})
      .then(() => {
        dispatch(saveSuppliersSuccess())
      })
      .catch(err => dispatch(saveSuppliersFailure(err)))
  }
}

export const SAVE_CREATED_SUPPLIER = 'SAVE_CREATED_SUPPLIER'
export const saveCreatedSupplier = (name) => ({
  type: SAVE_CREATED_SUPPLIER,
  payload: name
})

export const RESET_SUPPLIERS = 'RESET_SUPPLIERS'
export const resetSuppliers = () => ({
  type: RESET_SUPPLIERS
})
