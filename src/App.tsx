import React, { FC } from "react";
import Header from "./components/Header";
import CssBaseline from "@material-ui/core/CssBaseline";

import useInitialization from "./hooks/useInitialization"
import MainRouter from "./Router";
import { PageLoading } from "./components/util/PageLoading";
import GlobalStyle from "./styles/globalStyle";

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
      <GlobalStyle/>
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
            overflow: "overlay", 
            overflowX: "hidden", 
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

export default App;
