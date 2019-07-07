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
  }
}

const loadBegin = (draft: AnyState) => {
  draft.isLoading = true
  draft.isLoaded = false
  draft.loadingError = false
  return draft
}

const loadSuccess = (
  draft: AnyState, 
  targets: string[] | string, 
  payload: AnyState
  ) => {
  //console.log("loadSuccess payload: ", payload)
  //console.log("Input of loadSuccess: ", {draft, targets, payload})
  let newDraft = {...draft, ...payload}
  newDraft.isLoading = false
  newDraft.isLoaded = true
  if(Array.isArray(targets)){
    //console.log("targets is array")
    targets.forEach(target => {
      newDraft[target] = payload[targets[0]]
    })
  } else if(typeof targets === "string"){
    //console.log("targets is string")
    newDraft[targets] = payload[targets]
  }
  //console.log("Returning draft: ", newDraft)
  return newDraft
}

const loadFailure = (draft: AnyState, error: any) => {
  draft.isLoading = false
  draft.isLoaded = false
  draft.loadingError = true
  draft.error = error
  return draft
}

const saveBegin = (draft: AnyState) => {
  let ret = {...draft}
  ret.isSaving = true
  ret.isSaved = false
  ret.savingError = false
  ret.error = null
  return ret
}

const saveSuccess = (draft: AnyState) => {
  let ret = {...draft}
  ret.isSaving = false
  ret.isSaved = true
  return ret
}

const saveFailure = (draft: AnyState, error: string) => {
  let ret = {...draft}
  ret.isSaving = false
  ret.isSaved = false
  ret.savingError = true
  ret.error = error
  return ret
}

const setLastChanged = (draft: AnyState, date: Date) => {
  draft.lastChanged = date
  return draft
}

const resetReducer = (initialState: AnyState) => {
  let ret = {...initialState}
  ret.isLoaded = false
  return ret
}

export default {
  initializeState,
  loadBegin,
  loadSuccess,
  loadFailure,
  saveBegin,
  saveSuccess,
  saveFailure,
  setLastChanged,
  resetReducer
}