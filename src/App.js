import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useLoadedGate from "./hooks/useLoadedGate";
import { loadUser, setLocationName, setLocationColor, setLocationLogo } from "./redux/actions/authActions"
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
  const [user, initializingUser] = useAuthState(auth)
  const dispatch = useDispatch();
  const authIsLoaded = useSelector(state => state.auth.isLoaded)
  const authCurrentLocation = useSelector(state => state.auth.currentLocation)

  async function fetchLocationData(location){
    let data = await firestore.doc(`Clients/${location}`).get().then(res => {
      return res.data()
    })
    await data.name && dispatch(setLocationName(data.name))
    await data.logoUrl && dispatch(setLocationLogo(data.logoUrl))
    await data.primaryColor && dispatch(setLocationColor(data.primaryColor))
    await initializeLocation(data.firebaseConfig)
  }

  const fetchUserData = () => {
    dispatch(loadUser(user.uid))
  }

  const userLoggedOut = useSelector(state => state.auth.loggedOut)
  const [isLoadingUser, setLoadingUser] = useState(false)
  //INITIALIZE IF USER IS LOGGED IN
  useEffect(() => {
    //console.log(`user: ${Boolean(user)}, authIsLoaded: ${authIsLoaded}`)
    //if(user){console.log("user: ", user)}
    if(user && !isLoadingUser && !authIsLoaded && !userLoggedOut){
      //console.log("user: ", user)
      console.log("Fetching user data")
      setLoadingUser(true)
      fetchUserData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authIsLoaded, userLoggedOut])
  
  //LOAD LOCATION WHEN USER IS LOADED
  useEffect(() => {
    if(authIsLoaded){
      setLoadingUser(false)
      fetchLocationData(authCurrentLocation).then(() => loadLocation())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsLoaded, authCurrentLocation])

  const loadLocation = () => {
    dispatch(loadOrders());
    dispatch(loadProducts());
    dispatch(loadCategories());
    dispatch(loadSuppliers());
    dispatch(loadSales())
    dispatch(loadCustomers())
  }

  const [isLoadingGate, isLoadedGate, loadingErrorGate] = useLoadedGate()

  //console.log("App is rendering...")

  if(isLoadingGate || initializingUser || isLoadingUser){
    return <AppWrapper isLoaded={isLoadedGate}><PageLoading/></AppWrapper>
  } else if (!user){
    return <AppWrapper isLoaded={isLoadedGate}><NonAuthPage/></AppWrapper>
  } else if (loadingErrorGate){
    return <AppWrapper isLoaded={isLoadedGate}><p>Error!</p></AppWrapper>
  } else if (isLoadedGate) {
    return <AppWrapper isLoaded={isLoadedGate}><AuthPage/></AppWrapper>
  } else {
    //console.log("App returning default")
    return <AppWrapper isLoaded={isLoadedGate}><PageLoading/></AppWrapper>
  }
};

const AppWrapper = ({ children, loadingState, isLoaded }) => {
  return(
    <>
      <CssBaseline/>
      <main
        style={{
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <Header locationIsLoaded={isLoaded}/>
        <section style={{ height: "100%", overflowY: "scroll", marginTop: "5vh"}}>
          {children}
        </section>
      </main>
    </>
  )
}

const NonAuthPage = () => {
  return(
    <div style={{margin: "5vh 10vw 10vh 10vw", display: "grid"}}>
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
