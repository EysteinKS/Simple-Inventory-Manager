import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import useGate from "./hooks/useGate";
import { loadProducts } from "./redux/actions/productsActions";
import { loadOrders } from "./redux/actions/ordersActions";
import { loadCategories } from "./redux/actions/categoriesActions";
import { loadSuppliers } from "./redux/actions/suppliersActions"
import { loadSales } from "./redux/actions/salesActions"
import { loadCustomers } from "./redux/actions/customersActions"

import { Router } from "@reach/router"
import * as routes from "./constants/routes"
import Header from "./components/Header"
import Products from "./pages/Products"
import Orders from "./pages/Orders"
import Sales from "./pages/Sales"
import History from "./pages/History"

import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline"
import "./App.css";

const App = () => {

  const prodSelector = useSelector(state => state.products)
  const catSelector = useSelector(state => state.categories)
  const ordSelector = useSelector(state => state.orders)
  const suppSelector = useSelector(state => state.suppliers)
  const saleSelector = useSelector(state => state.sales)
  const custSelector = useSelector(state => state.customers) 
  
  const isLoadingArr2 = useMemo(() => [
    prodSelector.isLoading, catSelector.isLoading, 
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ], [
    prodSelector.isLoading, catSelector.isLoading,
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ])

  const isLoadedArr2 = useMemo(() => [
    prodSelector.isLoaded, catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ], [
    prodSelector.isLoaded,catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ])

  const loadingErrorArr2 = useMemo(() => [
    prodSelector.loadingError, catSelector.loadingError,
    ordSelector.loadingError, suppSelector.loadingError,
    saleSelector.loadingError, custSelector.loadingError
  ], [
    prodSelector.loadingError, catSelector.loadingError,
    ordSelector.loadingError, suppSelector.loadingError,
    saleSelector.loadingError, custSelector.loadingError
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
      dispatch(loadSuppliers());
      dispatch(loadSales())
      dispatch(loadCustomers())
    }
  }, [dispatch, isLoadingGate, isLoadedGate, loadingErrorGate]);
 
  return (
    <>
    <CssBaseline/>
    <main
      style={{
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <Header/>
      <section style={{ height: "100%", overflowY: "scroll", marginTop: "5vh"}}>
        {isLoadingGate ? <PageLoading/> 
        : loadingErrorGate ? <p>Error!</p> 
        : isLoadedGate ? <Page/> : null}
      </section>
    </main>
    </>
  );
};

const Page = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return(
    <div style={{margin: "5vh 10vw 10vh 10vw"}}>
      <Router primary={false}>
        <Products path={routes.HOME}/>
        <Orders path={routes.ORDERS}/>
        <Sales path={routes.SALES}/>
        <History path={routes.HISTORY}/>
      </Router>
    </div>
  )
}

const PageLoading = () => <CircularProgress style={{ alignSelf: "center", justifySelf: "center" }}/>

export default App;
