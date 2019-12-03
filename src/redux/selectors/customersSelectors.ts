import { RootState } from "../types";
import { createSelector } from "reselect";

const customersSelector = (state: RootState) => state.customers.customers;

export const selectCustomerNames = createSelector(
  [customersSelector],
  customers => customers.map(c => c.name)
);
