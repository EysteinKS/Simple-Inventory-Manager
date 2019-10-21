import { AnyAction } from "redux";
import produce from "immer";
import { ReportsState } from "../types";

import * as actions from "../actions/reportsActions";

const initialState = {
  isSaving: false,
  isSaved: true,
  savingError: null,
  dates: {
    isLoading: false,
    isLoaded: false,
    loadingError: null,
    byDate: null
  },
  report: {
    isLoading: false,
    isLoaded: false,
    loadingError: null,
    report: null
  },
  changes: []
};

export default (
  state: ReportsState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case actions.INITIALIZE_REPORTS:
        return initialState;

      case actions.LOAD_REPORT_DATES_BEGIN:
        draft.dates.isLoading = true;
        draft.dates.isLoaded = false;
        draft.dates.loadingError = null;
        draft.dates.byDate = null;
        return draft;

      case actions.LOAD_REPORT_DATES_SUCCESS:
        draft.dates.isLoading = false;
        draft.dates.isLoaded = true;
        draft.dates.byDate = payload;
        return draft;

      case actions.LOAD_REPORT_DATES_FAILURE:
        draft.dates.isLoading = false;
        draft.dates.isLoaded = false;
        draft.dates.loadingError = payload;
        draft.dates.byDate = null;
        return draft;

      case actions.LOAD_REPORT_BEGIN:
        draft.report.isLoading = true;
        draft.report.isLoaded = false;
        draft.report.loadingError = null;
        draft.report.report = null;
        return draft;

      case actions.LOAD_REPORT_SUCCESS:
        draft.report.isLoading = false;
        draft.report.isLoaded = true;
        draft.report.report = payload;
        return draft;

      case actions.LOAD_REPORT_FAILURE:
        draft.report.isLoading = false;
        draft.report.isLoaded = false;
        draft.report.report = null;
        draft.report.loadingError = payload;
        return draft;

      case actions.SAVE_REPORT_BEGIN:
        draft.isSaving = true;
        draft.isSaved = false;
        draft.savingError = null;
        return draft;

      case actions.SAVE_REPORT_SUCCESS:
        draft.isSaving = false;
        draft.isSaved = true;
        draft.changes = [];
        return draft;

      case actions.SAVE_REPORT_FAILURE:
        draft.isSaving = false;
        draft.isSaved = false;
        draft.savingError = payload;
        return draft;

      case actions.ADD_CHANGE:
        draft.changes.push(payload);
        return draft;

      case actions.RESET_REPORTS:
        return initialState;
        
      default:
        return draft;
    }
  });
