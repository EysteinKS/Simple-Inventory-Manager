import { AnyState } from "../types";

const initializeState = (optionals = {}): any => {
  return {
    ...optionals,
    currentID: 0,
    isLoading: false,
    isLoaded: false,
    loadingError: false,
    isSaving: false,
    isSaved: true,
    savingError: false,
    error: null
  };
};

const loadBegin = (draft: AnyState) => {
  draft.isLoading = true;
  draft.isLoaded = false;
  draft.loadingError = false;
  return draft;
};

const loadSuccess = (
  draft: AnyState,
  targets: string[] | string,
  payload: any
) => {
  let newDraft = { ...draft, ...payload } as any;
  newDraft.isLoading = false;
  newDraft.isLoaded = true;
  if (Array.isArray(targets)) {
    targets.forEach(target => {
      newDraft[target] = payload[targets[0]];
    });
  } else if (typeof targets === "string") {
    newDraft[targets] = payload[targets];
  }
  return newDraft;
};

const loadFailure = (draft: AnyState, error: any) => {
  draft.isLoading = false;
  draft.isLoaded = false;
  draft.loadingError = true;
  draft.error = error;
  return draft;
};

const saveBegin = (draft: AnyState) => {
  let ret = { ...draft };
  ret.isSaving = true;
  ret.isSaved = false;
  ret.savingError = false;
  ret.error = null;
  return ret;
};

const saveSuccess = (draft: AnyState) => {
  let ret = { ...draft };
  ret.isSaving = false;
  ret.isSaved = true;
  return ret;
};

const saveFailure = (draft: AnyState, error: string) => {
  let ret = { ...draft };
  ret.isSaving = false;
  ret.isSaved = false;
  ret.savingError = true;
  ret.error = error;
  return ret;
};

const resetReducer = (initialState: AnyState) => {
  let ret = { ...initialState };
  ret.isLoaded = false;
  return ret;
};

export default {
  initializeState,
  loadBegin,
  loadSuccess,
  loadFailure,
  saveBegin,
  saveSuccess,
  saveFailure,
  resetReducer
};
