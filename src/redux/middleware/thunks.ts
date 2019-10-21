import { secondaryFirestore } from "../../firebase/firebase";
import { setLocalStorage } from "./localStorage";
import { saveLastChanged } from "../actions/authActions";
import { parseDate, shouldLog } from "../../constants/util";

import { IThunkAction } from "./types";
import { RootState } from "../types";
import { Action } from "redux";

interface IStringKeys {
  [index: string]: string;
}

const firestoreSections: IStringKeys = {
  categories: "Categories",
  customers: "Customers",
  orders: "Orders",
  products: "Products",
  sales: "Sales",
  suppliers: "Suppliers",
  reports: "Reports",
  loans: "Loans"
};

const getSectionString = (section: string) => {
  return firestoreSections[section];
};

export const getCurrentLocation = (state: RootState) => {
  const location = state.auth.user.currentLocation;
  return location;
};

type THandleResponse = (data: any) => Object;
type TDataToSave = (state: any) => Object;

interface PayloadAction<T> {
  type: string;
  payload: T;
}
type TStringAction = () => Action<string>;
type TInputAction<T> = (input: T) => PayloadAction<T>;

export const getSectionFromFirestore = (
  section: string,
  onBegin: TStringAction,
  onSuccess: TInputAction<any>,
  onFailure: TInputAction<string>,
  handleResponse: THandleResponse
): IThunkAction => async (dispatch, getState) => {
  const state = getState();
  let location = getCurrentLocation(state);
  let sectionString = getSectionString(section);
  dispatch(onBegin());
  secondaryFirestore
    .doc(`${location}/${sectionString}`)
    .get()
    .then(res => {
      let data = res.data();
      if (!handleResponse || typeof handleResponse !== "function") {
        shouldLog(`Loaded ${section} successfully`);
        dispatch(onSuccess(data));
        setLocalStorage(section, data);
      } else if (typeof handleResponse === "function") {
        let handled = handleResponse(data);
        dispatch(onSuccess(handled));
        setLocalStorage(section, handled);
      }
    })
    .catch(err => dispatch(onFailure(err.message)));
};

type TDateKeys = "dateOrdered" | "dateReceived" | "dateSent";
type TSaleDates = {
  dateOrdered: Date | string | null;
  dateSent: Date | string | null;
  [key: string]: any;
};
type TOrderDates = {
  dateOrdered: Date | string | null;
  dateReceived: Date | string | null;
  [key: string]: any;
};
type TArrayWithDates = Array<TSaleDates | TOrderDates>;

/**
 * @function
 * @param {Array} data - Array of data which contains keys provided
 * @param {Array} keys - Array of keys that contain timestamps
 * @returns Array with updated date properties
 */

export const convertTimestampsToDates = (
  data: TArrayWithDates,
  keys: TDateKeys[]
): Array<any> => {
  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid data in convertTimestampsToDates");
  }
  return data.map(part => {
    keys.forEach(key => {
      if (part[key] === undefined) {
        throw new Error(`Key ${key} is undefined in ${part.name}`);
      } else if (part[key] !== null) {
        part[key] = parseDate(part[key]);
      }
    });
    return part;
  });
};

export const setSectionToFirestore = (
  date: Date,
  section: string,
  onBegin: TStringAction,
  onSuccess: TStringAction,
  onFailure: TInputAction<string>,
  saveFromState: TDataToSave
): IThunkAction => async (dispatch, getState) => {
  const state = getState();
  let location = getCurrentLocation(state);
  let sectionString = getSectionString(section);
  let dataToSave = saveFromState(state);
  dispatch(onBegin());
  shouldLog("setSectionToFirestore: ", {
    location: `${location}/${sectionString}`,
    dataToSave
  });
  secondaryFirestore
    .doc(`${location}/${sectionString}`)
    .set(dataToSave, { merge: true })
    .then(() => {
      dispatch(onSuccess());
      dispatch(saveLastChanged(section, date));
      setLocalStorage(section, { ...dataToSave });
    })
    .catch(err => dispatch(onFailure(err.message)));
};
