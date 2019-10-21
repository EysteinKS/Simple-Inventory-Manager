import { createSelector } from "reselect";
import { RootState } from "../types";

const loansSelector = (state: RootState) => state.loans.loans;

export const hasActiveLoans = createSelector(
  [loansSelector],
  loans => loans.length > 0
);
