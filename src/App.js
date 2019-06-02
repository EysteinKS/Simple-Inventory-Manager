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
import Login from "./components/Login"

import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline"
import "./App.css";

import { useAuthState } from "react-firebase-hooks/auth"
import { auth, firestore, initializeLocation } from "./firebase/firebase"

const App = () => {
  const [user, intialising, error] = useAuthState(auth)
  const dispatch = useDispatch();

  async function fetchData(){
    //await auth.signInWithEmailAndPassword("eystein.kolsto@gmail.com", "Eyks1995")
    let config = await firestore.doc("Clients/Barcontrol").get().then(res => {
      return res.data().firebaseConfig
    })
    await initializeLocation(config)
  }

  //INITIALIZE IF USER IS LOGGED IN
  useEffect(() => {
    if(user){
      fetchData().then(() => loadLocation())
    }
  }, [user])

  useEffect(() => {
    console.log(user)
  }, [user])

  const loadLocation = () => {
    dispatch(loadOrders());
    dispatch(loadProducts());
    dispatch(loadCategories());
    dispatch(loadSuppliers());
    dispatch(loadSales())
    dispatch(loadCustomers())
  }

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
        : isLoadedGate ? <AuthPage/> : null}
      </section>
    </main>
    </>
  );
};

const NonAuthPage = () => {
  return(
    <Login/>
  )
}

const AuthPage = () => {
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

const PageLoading = () => <div style={{display: "flex", justifyContent: "center", height: "100%"}}><CircularProgress style={{ alignSelf: "center", justifySelf: "center" }}/></div>

export default App;
