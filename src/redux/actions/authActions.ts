import { firestore } from "../../firebase/firebase";
import { setLocalStorage, authKey } from "../middleware/localStorage";
import { IThunkAction } from "../middleware/types";
import { LastChanged, UserState } from "../types";
import {
  updateProductVisibility,
  updateTooltipVisibility,
  updateUseAutoSave,
  updateTimeToAutoSave
} from "../../api/auth";
import { notifications, addNotification } from "./notificationActions";

export const USER_SIGNED_OUT = "USER_SIGNED_OUT";
export const userSignedOut = () => ({
  type: USER_SIGNED_OUT
});

export const USER_LOGGING_IN = "USER_LOGGING_IN";
export const userLoggingIn = () => ({
  type: USER_LOGGING_IN
});

export const LOAD_USER_BEGIN = "LOAD_USER_BEGIN";
export const loadUserBegin = () => ({
  type: LOAD_USER_BEGIN
});

export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const loadUserSuccess = (payload: UserState) => ({
  type: LOAD_USER_SUCCESS,
  payload: payload
});

export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";
export const loadUserFailure = (error: string) => ({
  type: LOAD_USER_FAILURE,
  payload: error
});

export const loadUser = (uid: string): IThunkAction => {
  return async dispatch => {
    dispatch(loadUserBegin());
    firestore
      .doc(`Users/${uid}`)
      .get()
      .then(res => {
        let data = res.data() as UserState;

        //In case useAutoSave is unset
        if (!data.settings.hasOwnProperty("useAutoSave")) {
          data.settings.useAutoSave = false;
        }

        if (!data.settings.hasOwnProperty("timeToAutoSave")) {
          data.settings.timeToAutoSave = 10000;
        }

        dispatch(loadUserSuccess(data));
      })
      .catch(err => dispatch(loadUserFailure(err.message)));
  };
};

export const SET_LOCATION_NAME = "SET_LOCATION_NAME";
export const setLocationName = (name: string) => ({
  type: SET_LOCATION_NAME,
  payload: name
});

export const SET_LOCATION_LOGO = "SET_LOCATION_LOGO";
export const setLocationLogo = (url: string | null) => ({
  type: SET_LOCATION_LOGO,
  payload: url
});

export const SET_LOCATION_COLOR = "SET_LOCATION_COLOR";
export const setLocationColor = (hex: string | null) => ({
  type: SET_LOCATION_COLOR,
  payload: hex
});

export const SET_ALL_LAST_CHANGED = "SET_ALL_LAST_CHANGED";
export const setAllLastChanged = (lastChanged: LastChanged) => ({
  type: SET_ALL_LAST_CHANGED,
  payload: lastChanged
});

export const SET_LAST_CHANGED = "SET_LAST_CHANGED";
export const setLastChanged = (section: string, date: string | Date) => ({
  type: SET_LAST_CHANGED,
  payload: { section, date }
});

export const saveLastChanged = (section: string, date: Date): IThunkAction => {
  return async (dispatch, getState) => {
    let state = getState();
    firestore
      .doc(`Clients/${state.auth.user.currentLocation}`)
      .update({
        "lastChanged.global": date,
        [`lastChanged.sections.${section}`]: date
      })
      .then(() => {
        dispatch(setLastChanged(section, date));
        dispatch(addNotification(notifications.savedChanges()));
        let updatedAuthStorage = {
          ...state.auth,
          lastChanged: {
            global: date,
            sections: {
              ...state.auth.location.lastChanged.sections,
              [section]: date
            }
          }
        };
        setLocalStorage(authKey, { location: updatedAuthStorage });
      })
      .catch(err => {
        console.error("error saving lastChanged: ", err.message);
      });
  };
};

export const RESET_AUTH = "RESET_AUTH";
export const resetAuth = () => ({
  type: RESET_AUTH
});

export const SET_NEW_CHANGES = "SET_NEW_CHANGES";
export const setNewChanges = () => ({
  type: SET_NEW_CHANGES
});

export const TOGGLE_VISIBLE = "TOGGLE_VISIBLE";
export const toggleVisible = (): IThunkAction => async (dispatch, getState) => {
  const action = { type: TOGGLE_VISIBLE };
  dispatch(action);
  if (!getState().auth.isDemo) {
    const visibility = getState().auth.user.settings.isInactiveVisible;
    updateProductVisibility(visibility).catch(err => console.log(err));
  }
};

export const TOGGLE_TOOLTIPS = "TOGGLE_TOOLTIPS";
export const toggleTooltips = (): IThunkAction => async (
  dispatch,
  getState
) => {
  const action = { type: TOGGLE_TOOLTIPS };
  dispatch(action);
  const visibility = getState().auth.user.settings.showTooltips;
  updateTooltipVisibility(visibility).catch(err => console.log(err));
};

export const TOGGLE_AUTOSAVE = "TOGGLE_AUTOSAVE";
export const toggleAutoSave = (): IThunkAction => async (
  dispatch,
  getState
) => {
  const action = { type: TOGGLE_AUTOSAVE };
  dispatch(action);
  const bool = getState().auth.user.settings.useAutoSave;
  updateUseAutoSave(bool).catch(err => console.log(err));
};

export const SET_AUTOSAVE_TIME = "SET_AUTOSAVE_TIME";
export const setAutoSaveTime = (
  time: number
): IThunkAction => async dispatch => {
  const action = { type: SET_AUTOSAVE_TIME, payload: time };
  dispatch(action);
  updateTimeToAutoSave(time).catch(err => console.log(err));
};

export const SET_DEMO = "SET_DEMO";
export const setDemo = (bool: boolean) => ({
  type: SET_DEMO,
  payload: bool
});
