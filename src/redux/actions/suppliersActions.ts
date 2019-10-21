import {
  getSectionFromFirestore,
  setSectionToFirestore
} from "../middleware/thunks";
import { ISupplier } from "../types";

const thisSection = "suppliers";

export const LOAD_SUPPLIERS_BEGIN = "LOAD_SUPPLIERS_BEGIN";
export const loadSuppliersBegin = () => ({
  type: LOAD_SUPPLIERS_BEGIN
});

export const LOAD_SUPPLIERS_SUCCESS = "LOAD_SUPPLIERS_SUCCESS";
type TLoadSuppliersSuccess = {
  suppliers: ISupplier[];
  currentID: number;
};
export const loadSuppliersSuccess = ({
  suppliers,
  currentID
}: TLoadSuppliersSuccess) => ({
  type: LOAD_SUPPLIERS_SUCCESS,
  payload: { suppliers, currentID }
});

export const LOAD_SUPPLIERS_FAILURE = "LOAD_SUPPLIERS_FAILURE";
export const loadSuppliersFailure = (error: string) => ({
  type: LOAD_SUPPLIERS_FAILURE,
  payload: error
});

export const loadSuppliers = () =>
  getSectionFromFirestore(
    thisSection,
    loadSuppliersBegin,
    loadSuppliersSuccess,
    loadSuppliersFailure,
    data => {
      return {
        suppliers: data.suppliers,
        currentID: data.currentID
      };
    }
  );

//SAVING

export const SAVE_SUPPLIERS_BEGIN = "SAVE_SUPPLIERS_BEGIN";
export const saveSuppliersBegin = () => ({
  type: SAVE_SUPPLIERS_BEGIN
});

export const SAVE_SUPPLIERS_SUCCESS = "SAVE_SUPPLIERS_SUCCESS";
export const saveSuppliersSuccess = () => ({
  type: SAVE_SUPPLIERS_SUCCESS
});

export const SAVE_SUPPLIERS_FAILURE = "SAVE_SUPPLIERS_FAILURE";
export const saveSuppliersFailure = (error: string) => ({
  type: SAVE_SUPPLIERS_FAILURE,
  payload: error
});

export const saveSuppliers = (date: Date) =>
  setSectionToFirestore(
    date,
    thisSection,
    saveSuppliersBegin,
    saveSuppliersSuccess,
    saveSuppliersFailure,
    state => {
      let s = state.suppliers;
      return {
        suppliers: s.suppliers,
        currentID: s.currentID
      };
    }
  );

export const SAVE_CREATED_SUPPLIER = "SAVE_CREATED_SUPPLIER";
export const saveCreatedSupplier = (name: string) => ({
  type: SAVE_CREATED_SUPPLIER,
  payload: name
});

export const SAVE_EDITED_SUPPLIER = "SAVE_EDITED_SUPPLIER";
export const saveEditedSupplier = (edited: ISupplier) => ({
  type: SAVE_EDITED_SUPPLIER,
  payload: edited
});

export const RESET_SUPPLIERS = "RESET_SUPPLIERS";
export const resetSuppliers = () => ({
  type: RESET_SUPPLIERS
});
