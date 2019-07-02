import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useLoadedGate from "./hooks/useLoadedGate";
import {
  loadUser,
  setLocationName,
  setLocationColor,
  setLocationLogo,
  setAllLastChanged,
  userSignedOut
} from "./redux/actions/authActions";

import { Router } from "@reach/router";
import * as routes from "./constants/routes";
import Header from "./components/Header";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import History from "./pages/History";
import Login from "./components/Login";

import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, initializeLocation } from "./firebase/firebase";
import { getInventory } from  "./redux/middleware/firestore"
import { convertTimestampToDate } from "./constants/util"

//TODO
//FIGURE OUT HOW TO RESET REDUX WITHOUT CRASHING THE APP
//REFACTOR THE LOADING BEHAVIOR

const App = () => {
  const [user, initializingUser] = useAuthState(auth);
  const dispatch = useDispatch();
  const authIsLoaded = useSelector(state => state.auth.isLoaded);
  const authCurrentLocation = useSelector(state => state.auth.currentLocation);
  const userLoggingOut = useSelector(state => state.auth.loggingOut);

  useEffect(() => {
    if(!user && userLoggingOut){
      dispatch(userSignedOut())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoggingOut])

  async function fetchLocationData(location) {
    await firestore.doc(`Clients/${location}`).get()
      .then(async res => {
        const data = res.data();
        //console.log("Data from Firestore: ", data)
        dispatch(setLocationName(data.name));
        dispatch(setLocationLogo(data.logoUrl));
        dispatch(setLocationColor(data.primaryColor));
        const lastChangedToDate = (data) => {
          let updated = {...data}
          //console.log("lastChangedToDate: ", updated)
          updated.global = convertTimestampToDate(updated.global)
          for (let k in updated.sections){
            updated.sections[k] = convertTimestampToDate(updated.sections[k])
          }
          //console.log("updated: ", updated)
          return updated
        }
        let updatedLastChanged = lastChangedToDate(data.lastChanged)
        //console.log("updatedLastChanged: ", updatedLastChanged)
        dispatch(setAllLastChanged(updatedLastChanged))
        initializeLocation(data.firebaseConfig);
      });
  }

  const fetchUserData = () => {
    dispatch(loadUser(user.uid));
  };

  const [isLoadingUser, setLoadingUser] = useState(false);
  //INITIALIZE IF USER IS LOGGED IN
  useEffect(() => {
    //console.log(`user: ${Boolean(user)}, authIsLoaded: ${authIsLoaded}`)
    //if(user){console.log("user: ", user)}
    if (user && !isLoadingUser && !authIsLoaded && !userLoggingOut) {
      //console.log("user: ", user)
      console.log("Fetching user data");
      console.time("Time until interactive")
      setLoadingUser(true);
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authIsLoaded, userLoggingOut]);

  //LOAD LOCATION WHEN USER IS LOADED
  useEffect(() => {
    if (authIsLoaded) {
      setLoadingUser(false);
      fetchLocationData(authCurrentLocation).then(() => dispatch(getInventory()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsLoaded, authCurrentLocation]);

  const [isLoadingGate, isLoadedGate, loadingErrorGate] = useLoadedGate();

  //console.log("App is rendering...")
  useEffect(() => {
    isLoadedGate && console.timeEnd("Time until interactive")
  }, [isLoadedGate])

  if (isLoadingGate || initializingUser || isLoadingUser || (user && userLoggingOut)) {
    return (
      <AppWrapper isLoaded={isLoadedGate}>
        <PageLoading />
      </AppWrapper>
    );
  } else if (!user) {
    return (
      <AppWrapper isLoaded={isLoadedGate}>
        <NonAuthPage />
      </AppWrapper>
    );
  } else if (loadingErrorGate) {
    return (
      <AppWrapper isLoaded={isLoadedGate}>
        <p>Error!</p>
      </AppWrapper>
    );
  } else if (isLoadedGate && user) {
    return (
      <AppWrapper isLoaded={isLoadedGate}>
        <AuthPage />
      </AppWrapper>
    );
  } else {
    //console.log("App returning default")
    return (
      <AppWrapper isLoaded={isLoadedGate}>
        <PageLoading />
      </AppWrapper>
    );
  }
};

const AppWrapper = ({ children, isLoaded }) => {
  return (
    <>
      <CssBaseline />
      <main
        style={{
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <Header locationIsLoaded={isLoaded} />
        <section
          style={{ height: "100%", overflowY: "scroll", marginTop: "5vh" }}
        >
          {children}
        </section>
      </main>
    </>
  );
};

const NonAuthPage = () => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login />
    </div>
  );
};

const AuthPage = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <Router primary={false}>
        <Products path={routes.HOME} />
        <Orders path={routes.ORDERS} />
        <Sales path={routes.SALES} />
        <History path={routes.HISTORY} />
      </Router>
    </div>
  );
};

const PageLoading = () => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <CircularProgress style={{ alignSelf: "center", justifySelf: "center" }} />
  </div>
);

export default App;
