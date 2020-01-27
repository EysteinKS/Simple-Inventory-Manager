import * as action from "../actions/authActions";
import { setLocalStorage, authKey } from "../middleware/localStorage";
import produce from "immer";
import { AuthState } from "../types";
import { AnyAction } from "redux";

const initialState: AuthState = {
  user: {
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    locations: [],
    currentLocation: "",
    settings: {
      language: "NO",
      showTooltips: true,
      isInactiveVisible: true,
      useAutoSave: false,
      timeToAutoSave: 10000
    }
  },
  location: {
    name: "",
    logoUrl: null,
    primaryColor: null,
    lastChanged: {
      global: new Date("2019-07-01T19:45:00"),
      sections: {
        categories: new Date("2019-07-01T19:45:00"),
        customers: new Date("2019-07-01T19:45:00"),
        orders: new Date("2019-07-01T19:45:00"),
        sales: new Date("2019-07-01T19:45:00"),
        suppliers: new Date("2019-07-01T19:45:00"),
        loans: new Date("2019-07-01T19:45:00")
      }
    }
  },
  isLoading: false,
  isLoaded: false,
  loadingError: null,
  isSaving: false,
  isSaved: true,
  savingError: null,
  loggingOut: false,
  hasNewChanges: false,
  error: null,
  isDemo: false
};

export default (
  state: AuthState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case action.USER_SIGNED_OUT:
        draft.loggingOut = false;
        break;

      case action.USER_LOGGING_IN:
      case action.LOAD_USER_BEGIN:
        draft.isLoading = true;
        draft.isLoaded = false;
        draft.loadingError = null;
        break;

      case action.LOAD_USER_SUCCESS:
        draft.user = payload;
        draft.isLoading = false;
        draft.isLoaded = true;
        break;

      case action.LOAD_USER_FAILURE:
        draft.isLoading = false;
        draft.isLoaded = true;
        draft.loadingError = payload;
        break;

      case action.SET_LOCATION_NAME:
        draft.location.name = payload;
        break;

      case action.SET_LOCATION_LOGO:
        draft.location.logoUrl = payload;
        break;

      case action.SET_LOCATION_COLOR:
        draft.location.primaryColor = payload;
        break;

      case action.SET_ALL_LAST_CHANGED:
        draft.location.lastChanged = payload;
        break;

      case action.SET_LAST_CHANGED:
        draft.location.lastChanged.global = payload.date;
        draft.location.lastChanged.sections[payload.section] = payload.date;
        break;

      case action.RESET_AUTH:
        let resetDraft = { ...initialState, loggingOut: true };
        setLocalStorage(authKey, resetDraft);
        return resetDraft;

      case action.SET_NEW_CHANGES:
        draft.hasNewChanges = true;
        return draft;

      case action.TOGGLE_VISIBLE:
        let visible = state.user.settings.isInactiveVisible;
        draft.user.settings.isInactiveVisible = !visible;
        return draft;

      case action.TOGGLE_TOOLTIPS:
        let showTooltips = state.user.settings.showTooltips;
        draft.user.settings.showTooltips = !showTooltips;
        return draft;

      case action.TOGGLE_AUTOSAVE:
        let useAutoSave = state.user.settings.useAutoSave;
        draft.user.settings.useAutoSave = !useAutoSave;
        return draft;

      case action.SET_AUTOSAVE_TIME:
        draft.user.settings.timeToAutoSave = payload;
        return draft;

      case action.SET_DEMO:
        draft.isDemo = payload;
        return draft;

      default:
        return state;
    }
  });
