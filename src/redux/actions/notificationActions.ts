import { INotification } from "../types";

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const addNotification = (payload: INotification) => ({
  type: ADD_NOTIFICATION,
  payload: payload
});

export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const removeNotification = (id: number) => ({
  type: REMOVE_NOTIFICATION,
  payload: id
});

export const notifications: { [key: string]: () => INotification } = {
  newChanges: () => ({
    message: "Nye endringer oppdaget, last inn siden på nytt",
    type: "warning",
    id: 1,
    timeout: 5
  }),
  savedChanges: () => ({
    message: "Endringene ble lagret",
    type: "success",
    id: 2,
    timeout: 2
  }),
  addedChange: () => ({
    message: "Endring lagt inn i lagringskøen",
    type: "info",
    id: Math.random(),
    timeout: 2
  }),
  savingError: () => ({
    message: "Det oppsto en feil, last inn siden på nytt",
    type: "warning",
    id: 3,
    timeout: 5
  })
};
