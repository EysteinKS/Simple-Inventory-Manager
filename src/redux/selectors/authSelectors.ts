import { RootState } from "../types";
import { createSelector } from "reselect";

//const authSelector = (state: RootState) => state.auth;
const userSelector = (state: RootState) => state.auth.user;

export const selectAutoSaveSetting = createSelector(
  [userSelector],
  user => user.settings.useAutoSave
);

export const selectTimeToAutoSave = createSelector(
  [userSelector],
  user => user.settings.timeToAutoSave
);
