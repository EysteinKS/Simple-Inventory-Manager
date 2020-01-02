import {
  getSectionFromFirestore,
  setSectionToFirestore
} from "../middleware/thunks";
import { ICustomer } from "../types";

const thisSection = "customers";

export const LOAD_CUSTOMERS_BEGIN = "LOAD_CUSTOMERS_BEGIN";
export const loadCustomersBegin = () => ({
  type: LOAD_CUSTOMERS_BEGIN
});

export const LOAD_CUSTOMERS_SUCCESS = "LOAD_CUSTOMERS_SUCCESS";
export const loadCustomersSuccess = ({
  customers,
  currentID
}: {
  customers: ICustomer[];
  currentID: number;
}) => ({
  type: LOAD_CUSTOMERS_SUCCESS,
  payload: { customers, currentID }
});

export const LOAD_CUSTOMERS_FAILURE = "LOAD_CUSTOMERS_FAILURE";
export const loadCustomersFailure = (error: string) => ({
  type: LOAD_CUSTOMERS_FAILURE,
  payload: error
});

export const loadCustomers = () =>
  getSectionFromFirestore(
    thisSection,
    loadCustomersBegin,
    loadCustomersSuccess,
    loadCustomersFailure,
    data => {
      return {
        customers: data.customers,
        currentID: data.currentID
      };
    }
  );

//SAVING

export const SAVE_CUSTOMERS_BEGIN = "SAVE_CUSTOMERS_BEGIN";
export const saveCustomersBegin = () => ({
  type: SAVE_CUSTOMERS_BEGIN
});

export const SAVE_CUSTOMERS_SUCCESS = "SAVE_CUSTOMERS_SUCCESS";
export const saveCustomersSuccess = () => ({
  type: SAVE_CUSTOMERS_SUCCESS
});

export const SAVE_CUSTOMERS_FAILURE = "SAVE_CUSTOMERS_FAILURE";
export const saveCustomersFailure = (error: string) => ({
  type: SAVE_CUSTOMERS_FAILURE,
  payload: error
});

export const saveCustomers = (date: Date) =>
  setSectionToFirestore(
    date,
    thisSection,
    saveCustomersBegin,
    saveCustomersSuccess,
    saveCustomersFailure,
    state => {
      return {
        customers: state.customers.customers,
        currentID: state.customers.currentID
      };
    }
  );

export const SAVE_CREATED_CUSTOMER = "SAVE_CREATED_CUSTOMER";
export const saveCreatedCustomer = (name: string) => ({
  type: SAVE_CREATED_CUSTOMER,
  payload: name
});

export const SAVE_EDITED_CUSTOMER = "SAVE_EDITED_CUSTOMER";
export const saveEditedCustomer = (edited: ICustomer) => ({
  type: SAVE_EDITED_CUSTOMER,
  payload: edited
});

export const RESET_CUSTOMERS = "RESET_CUSTOMERS";
export const resetCustomers = () => ({
  type: RESET_CUSTOMERS
});
