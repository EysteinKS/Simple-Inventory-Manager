import React, { FC } from "react";

import Header from "./components/Header";

import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

import useInitialization from "./hooks/useInitialization"
import MainRouter from "./Router";

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
    <>
      <CssBaseline />
      <main
        style={{
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <Header locationIsLoaded={isLoadedGate} />
        <section
          style={{ 
            height: "100%", 
            overflowY: "scroll", 
            marginTop: "5vh" }}
        >
          {(loading) ? <PageLoading message={loadingMessage}/>
          : (loadingErrorGate) ? <p>Error!</p>
          : <MainRouter 
              loggedIn={loggedIn} 
              loading={loading} 
              isLoaded={isLoadedGate} 
              message={loadingMessage}
              setMessage={setLoadingMessage}
            />}
        </section>
      </main>
    </>
  )
}

interface PageLoadingProps {
  message: string
}

export const PageLoading: FC<PageLoadingProps> = ({ message }) => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <div style={{display: "grid", gridTemplateColumns: "1fr", placeSelf: "center"}}>
      <CircularProgress style={{ placeSelf: "center"}}/>
      <p style={{ height: "2vh", placeSelf: "center" }}>{message}</p>
    </div>
  </div>
);

export default App;
