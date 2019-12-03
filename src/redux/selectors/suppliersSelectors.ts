import { RootState } from "../types";
import { createSelector } from "reselect";

const suppliersSelector = (state: RootState) => state.suppliers.suppliers;

export const selectSupplierNames = createSelector(
  [suppliersSelector],
  suppliers => suppliers.map(s => s.name)
);
