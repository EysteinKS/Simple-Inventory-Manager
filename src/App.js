
import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useGate, generateSelectors} from "./constants/hooks"
import { loadProducts } from "./redux/actions/productsActions"
import { loadOrders } from "./redux/actions/ordersActions"
import { loadCategories } from "./redux/actions/categoriesActions"

import CircularProgress from "@material-ui/core/CircularProgress"
import Main from "./components/Main"
import "./App.css"

const App = () => {
  const gateObjects = ["products", "categories", "orders"]
  let isLoadingSelector = generateSelectors(gateObjects, "isLoading", useSelector)
  let isLoadedSelector = generateSelectors(gateObjects, "isLoaded", useSelector)
  let loadingErrorSelector = generateSelectors(gateObjects, "loadingError", useSelector)

  const isLoadingGate = useGate(
    {gate: "OR", list: isLoadingSelector},
    {gate: "OR", list: ["isLoading"]}
  )
  const isLoadedGate = useGate(
    {gate: "AND", list: isLoadedSelector},
    {gate: "AND", list: ["isLoaded"]}
  )
  const loadingErrorGate = useGate(
    {gate: "OR", list: loadingErrorSelector},
    {gate: "OR", list: ["loadingError"]}
  )

  const dispatch = useDispatch()
  useEffect(() => {
    if(!isLoadingGate && !isLoadedGate){
      dispatch(loadOrders())
      dispatch(loadProducts())
      dispatch(loadCategories())
    }
  }, [dispatch, isLoadingGate, isLoadedGate, loadingErrorGate])

  const [content, setContent] = useState(null)
  useEffect(() => {
    //console.log("isLoadingGate: ", isLoadingGate)
    //console.log("isLoadedGate: ", isLoadedGate)
    if(isLoadingGate){
      setContent(<CircularProgress style={{alignSelf: "center", justifySelf: "center"}}/>)
    } else if (loadingErrorGate){
      setContent(<p>Error!</p>)
    } else if (isLoadedGate){
      setContent(<Main/>)
    }
  }, [isLoadingGate, loadingErrorGate, isLoadedGate])

  return(
    <div style={{
      display: "grid",
      paddingTop: "5vh",
      paddingBottom: "5vh",
      paddingLeft: "2vw",
      paddingRight: "2vw",
      height: "90vh",
      maxHeight: "90vh",
      width: "90vw"
    }}>
      {content}
    </div>
  )
}

export default App