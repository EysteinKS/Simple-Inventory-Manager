import { RootState } from "../redux/types";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import useGate from "./useGate";
import { saveCategories } from "../redux/actions/categoriesActions";
import { saveCustomers } from "../redux/actions/customersActions";
import { saveOrders } from "../redux/actions/ordersActions";
import { saveProducts } from "../redux/actions/productsActions";
import { saveReport } from "../redux/actions/reportsActions";
import { saveSales } from "../redux/actions/salesActions";
import { saveSuppliers } from "../redux/actions/suppliersActions";

const stateKeys = [
  "categories",
  "customers",
  "orders",
  "products",
  "reports",
  "sales",
  "suppliers"
]

const savingActions: any = {
  categories: saveCategories,
  customers: saveCustomers,
  orders: saveOrders,
  products: saveProducts,
  sales: saveSales,
  suppliers: saveSuppliers
}

interface IsavingState {
  [key: string]: {
    name: string
    isSaving: boolean
    isSaved: boolean
    error: string | null
  }
}

export default function useSaving() {
  const savingState = useSelector((state: RootState) => {
    let ret = {} as IsavingState
    stateKeys.forEach(key => ret[key] = {
      name: key,
      isSaving: state[key].isSaving,
      isSaved: state[key].isSaved,
      error: state[key].savingError
    })
    return ret
  })

  const isSaving = React.useMemo(() => stateKeys.map(key => savingState[key].isSaving), [savingState])
  const isSaved = React.useMemo(() => stateKeys.map(key => savingState[key].isSaved), [savingState])
  const savingError = React.useMemo(() => stateKeys.map(key => savingState[key].error), [savingState])

  const isSavingGate = useGate(isSaving, "OR", false)
  const isSavedGate = useGate(isSaved, "AND", true)
  const savingErrorGate = useGate(savingError, "OR", false)

  const getUnsavedSections = () => {
    let unsaved: string[] = []
    stateKeys.forEach((key, i) => {
      if (!isSaved[i] && !isSaving[i]) {
        console.log(key + " is unsaved")
        unsaved.push(key) 
      }
    })
    console.log("unsaved: ", unsaved)
    return unsaved
  }

  const dispatch = useDispatch()
  const save = () => {
    if(((!isSavingGate && !isSavedGate) || savingErrorGate)) {
      let unsavedSections = getUnsavedSections()
      console.log("Saving...")
      let date = new Date()
      try {
        unsavedSections.forEach(section => {
          if(section !== "reports") dispatch(savingActions[section](date))
        })
      } catch(err) {console.log(err)}
      console.log("Saving report from save")
      dispatch(saveReport(date))
    }
  }

  const timerRef = React.useRef(null as number | NodeJS.Timeout | null)
  const [ isTimerStarted, setTimerStarted ] = React.useState(false)
  const [ isTimerFinished, setTimerFinished ] = React.useState(true)


  //Autosave
  const doAutosave = false

  React.useEffect(() => {
    if(doAutosave && !isTimerStarted && !isSavedGate){
      console.log("Saving content...")
      console.log("Starting timeout")
      console.time("autosave")
      setTimerStarted(true)
      timerRef.current = window.setTimeout(() => {
        save();
        console.timeEnd("autosave");
      }, 1000)
      setTimerFinished(false)
    }
    //eslint-disable-next-line
  }, [isSavingGate, isSavedGate])

  React.useEffect(() => {
    if(doAutosave && !isTimerFinished && isTimerStarted && isSavedGate){
      console.log("Finished timeout")
      setTimerStarted(false)
      setTimerFinished(true)
      timerRef.current = null
    }
    //eslint-disable-next-line
  }, [isTimerFinished, isTimerStarted, isSavedGate])

  return [isSavingGate, isSavedGate, savingErrorGate, save]
}