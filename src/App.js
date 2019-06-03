import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import useGate from "./hooks/useGate";
import { loadUser, setLocationName } from "./redux/actions/authActions"
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

//TODO
//FIGURE OUT HOW TO RESET REDUX WITHOUT CRASHING THE APP
//REFACTOR THE LOADING BEHAVIOR

const App = () => {
  const [user, initialising, error] = useAuthState(auth)
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth)

  const fetchUserData = () => {
    dispatch(loadUser(user.uid))
  }

  async function fetchLocationData(location){
    let data = await firestore.doc(`Clients/${location}`).get().then(res => {
      return res.data()
    })
    await dispatch(setLocationName(data.name))
    await initializeLocation(data.firebaseConfig)
  }

  let isLoadingUser = false
  //INITIALIZE IF USER IS LOGGED IN
  useEffect(() => {
    if(user && !isLoadingUser){
      console.log("user: ", user)
      console.log("fetching user data")
      isLoadingUser = true
      fetchUserData()
    }
  }, [user, isLoadingUser])
  
  //LOAD LOCATION WHEN USER IS LOADED
  useEffect(() => {
    if(authUser.isLoaded){
      fetchLocationData(authUser.currentLocation).then(() => loadLocation())
    }
  }, [authUser.isLoaded, authUser.currentLocation])

  const loadLocation = () => {
    dispatch(loadOrders());
    dispatch(loadProducts());
    dispatch(loadCategories());
    dispatch(loadSuppliers());
    dispatch(loadSales())
    dispatch(loadCustomers())
  }

  const authSelector = useSelector(state => state.auth)
  const prodSelector = useSelector(state => state.products)
  const catSelector = useSelector(state => state.categories)
  const ordSelector = useSelector(state => state.orders)
  const suppSelector = useSelector(state => state.suppliers)
  const saleSelector = useSelector(state => state.sales)
  const custSelector = useSelector(state => state.customers) 
  
  const isLoadingArr2 = useMemo(() => [
    authSelector.isLoading,
    prodSelector.isLoading, catSelector.isLoading, 
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ], [
    authSelector.isLoading,
    prodSelector.isLoading, catSelector.isLoading,
    ordSelector.isLoading, suppSelector.isLoading,
    saleSelector.isLoading, custSelector.isLoading
  ])

  const isLoadedArr2 = useMemo(() => [
    authSelector.isLoaded,
    prodSelector.isLoaded, catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ], [
    authSelector.isLoaded,
    prodSelector.isLoaded,catSelector.isLoaded,
    ordSelector.isLoaded, suppSelector.isLoaded,
    saleSelector.isLoaded, custSelector.isLoaded
  ])

  const loadingErrorArr2 = useMemo(() => [
    authSelector.loadingError,
    prodSelector.loadingError, catSelector.loadingError,
    ordSelector.loadingError, suppSelector.loadingError,
    saleSelector.loadingError, custSelector.loadingError
  ], [
    authSelector.loadingError,
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
        {!user 
          ? <NonAuthPage/> 
          :isLoadingGate ? <PageLoading/> 
            : loadingErrorGate ? <p>Error!</p> 
            : isLoadedGate ? <AuthPage/> : null}
      </section>
    </main>
    </>
  );
};

const NonAuthPage = () => {
  return(
    <div style={{margin: "5vh 10vw 10vh 10vw"}}>
      <Login/>
    </div>
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
