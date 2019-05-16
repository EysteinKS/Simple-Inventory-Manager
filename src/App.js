import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGate } from "./constants/hooks";
import { loadProducts } from "./redux/actions/productsActions";
import { loadOrders } from "./redux/actions/ordersActions";
import { loadCategories } from "./redux/actions/categoriesActions";

import CircularProgress from "@material-ui/core/CircularProgress";
import Main from "./components/Main";
import "./App.css";

const App = () => {
  /* const selectorArray = [
    useSelector(state => state.products),
    useSelector(state => state.categories),
    useSelector(state => state.orders)
  ]

  const isLoadingArr = selectorArray.map(sel => sel.isLoading)
  const memoizedIsLoadingArr = useMemo(() => { return isLoadingArr }, [isLoadingArr])

  const isLoadedArr = selectorArray.map(sel => sel.isLoaded)
  const memoizedIsLoadedArr = useMemo(() => { return isLoadedArr }, [isLoadedArr])

  const loadingErrorArr = selectorArray.map(sel => sel.loadingError)
  const memoizedLoadingErrorArr = useMemo(() => { return loadingErrorArr }, [loadingErrorArr])
 */

  const prodSelector = useSelector(state => state.products)
  const catSelector = useSelector(state => state.categories)
  const ordSelector = useSelector(state => state.orders)
  
  const isLoadingArr2 = useMemo(() => [
    prodSelector.isLoading,
    catSelector.isLoading,
    ordSelector.isLoading
  ], [
    prodSelector.isLoading,
    catSelector.isLoading,
    ordSelector.isLoading
  ])

  const isLoadedArr2 = useMemo(() => [
    prodSelector.isLoaded,
    catSelector.isLoaded,
    ordSelector.isLoaded
  ], [
    prodSelector.isLoaded,
    catSelector.isLoaded,
    ordSelector.isLoaded
  ])

  const loadingErrorArr2 = useMemo(() => [
    prodSelector.loadingError,
    catSelector.loadingError,
    ordSelector.loadingError
  ], [
    prodSelector.loadingError,
    catSelector.loadingError,
    ordSelector.loadingError
  ])


  const isLoadingGate = useGate(isLoadingArr2, "OR", "isLoading");
  const isLoadedGate = useGate(isLoadedArr2, "AND", "isLoaded");
  const loadingErrorGate = useGate(loadingErrorArr2, "OR", "loadingError");

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoadingGate && !isLoadedGate) {
      dispatch(loadOrders());
      dispatch(loadProducts());
      dispatch(loadCategories());
    }
  }, [dispatch, isLoadingGate, isLoadedGate, loadingErrorGate]);

  return (
    <div
      style={{
        display: "grid",
        padding: "5vh 2vw",
        height: "90vh",
        maxHeight: "90vh",
        width: "90vw"
      }}
    >
      {isLoadingGate ? <CircularProgress style={{ alignSelf: "center", justifySelf: "center" }}/> 
      : loadingErrorGate ? <p>Error!</p> 
      : isLoadedGate ? <Main/> : null}
    </div>
  );
};

export default App;
