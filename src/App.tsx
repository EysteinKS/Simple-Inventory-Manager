import React, { ReactNode, FC } from "react";

import AuthPage from "./AuthPage"
import Header from "./components/Header";
import Login from "./components/Login";

import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

import useInitialization from "./hooks/useInitialization"

const App: FC = () => {
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

interface WrapperProps {
  children: ReactNode,
  isLoaded: boolean
}

const AppWrapper: FC<WrapperProps> = ({ children, isLoaded }) => {
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

interface NonAuthProps {
  setMessage: (message: string) => void
}

const NonAuthPage: FC<NonAuthProps> = ({ setMessage }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login setMessage={setMessage}/>
    </div>
  );
};

interface PageLoadingProps {
  message: string
}

const PageLoading: FC<PageLoadingProps> = ({ message }) => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <div style={{display: "grid", gridTemplateColumns: "1fr", placeSelf: "center"}}>
      <CircularProgress style={{ placeSelf: "center"}}/>
      <p style={{ height: "2vh", placeSelf: "center" }}>{message}</p>
    </div>
  </div>
);

export default App;
