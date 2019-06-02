const initializeState = (optionals = {}) => {
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

const loadBegin = (draft) => {
  draft.isLoading = true
  draft.isLoaded = false
  draft.loadingError = false
  draft.error = null
  return draft
}

const loadSuccess = (draft, targets = [], payload) => {
  //console.log("Input of loadSuccess: ", {draft, targets, payload})
  draft.isLoading = false
  draft.isLoaded = true
  if(Array.isArray(targets)){
    //console.log("targets is array")
    targets.forEach(target => {
      draft[target] = payload
    })
  } else if(typeof targets === "string"){
    //console.log("targets is string")
    draft[targets] = payload
  }
  //console.log("Returning draft: ", draft)
  return draft
}

const loadFailure = (draft, error) => {
  draft.isLoading = false
  draft.isLoaded = false
  draft.loadingError = true
  draft.error = error
  return draft
}

const saveBegin = (draft) => {
  let ret = {...draft}
  ret.isSaving = true
  ret.isSaved = false
  ret.savingError = false
  ret.error = null
  return ret
}

const saveSuccess = (draft) => {
  let ret = {...draft}
  ret.isSaving = false
  ret.isSaved = true
  return ret
}

const saveFailure = (draft, error) => {
  let ret = {...draft}
  ret.isSaving = false
  ret.isSaved = false
  ret.savingError = true
  ret.error = error
  return ret
}

export default {
  initializeState,
  loadBegin,
  loadSuccess,
  loadFailure,
  saveBegin,
  saveSuccess,
  saveFailure
}