import { firestore } from "../../firebase/firebase"

export const LOAD_SUPPLIERS_BEGIN = 'LOAD_SUPPLIERS_BEGIN'
export const loadSuppliersBegin = () => ({
  type: LOAD_SUPPLIERS_BEGIN,
})

export const LOAD_SUPPLIERS_SUCCESS = 'LOAD_SUPPLIERS_SUCCESS'
export const loadSuppliersSuccess = (suppliers = []) => ({
  type: LOAD_SUPPLIERS_SUCCESS,
  payload: suppliers
})

export const LOAD_SUPPLIERS_FAILURE = 'LOAD_SUPPLIERS_FAILURE'
export const loadsuppliersFailure = (error) => ({
  type: LOAD_SUPPLIERS_FAILURE,
  payload: error
})

export const loadSuppliers = () => {
  return dispatch => {
    dispatch(loadSuppliersBegin())
    firestore.doc("Barcontrol/Suppliers").get()
      .then(res => {
        let suppliers = res.data().suppliers
        console.log("Loaded suppliers successfully")
        dispatch(loadSuppliersSuccess(suppliers))
      })
      .catch(err => loadsuppliersFailure(err))
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
  return dispatch => {
    dispatch(saveSuppliersBegin())
    firestore.doc("Barcontrol/Suppliers").set({
      suppliers
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
