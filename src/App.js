import React from "react";

//ROUTER
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

import useInitialization from "./hooks/useInitialization"

const App = () => {
  const {
    loading,
    isLoadedGate,
    loadingErrorGate,
    loadingMessage,
    setLoadingMessage,
    loggedIn, 
  } = useInitialization()
  
  return(
    <AppWrapper isLoaded={isLoadedGate}>
      {(loading) ? <PageLoading message={loadingMessage}/>
      : (loadingErrorGate) ? <p>Error!</p>
      : (!loggedIn) ? <NonAuthPage setMessage={setLoadingMessage}/>
      : (isLoadedGate && loggedIn) ? <AuthPage/>
      : <PageLoading message={loadingMessage}/>}
    </AppWrapper>
  )
}

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
          style={{ 
            height: "100%", 
            overflowY: "scroll", 
            marginTop: "5vh" }}
        >
          {children}
        </section>
      </main>
    </>
  );
};

const NonAuthPage = ({ setMessage }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login setMessage={setMessage}/>
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

const PageLoading = ({ message }) => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <div style={{display: "grid", gridTemplateColumns: "1fr", placeSelf: "center"}}>
      <CircularProgress style={{ placeSelf: "center"}}/>
      <p style={{ height: "2vh", placeSelf: "center" }}>{message}</p>
    </div>
  </div>
);

export default App;
