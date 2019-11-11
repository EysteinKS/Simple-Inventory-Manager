import React, { FC } from "react";
import Header from "./components/Header";
import CssBaseline from "@material-ui/core/CssBaseline";

import useInitialization from "./hooks/useInitialization";
import MainRouter from "./Router";
import { PageLoading } from "./components/util/PageLoading";
import GlobalStyle from "./styles/globalStyle";

const App: FC = () => {
  const {
    loading,
    isLoadedGate,
    loadingErrorGate,
    loadingMessage,
    login,
    loggedIn
  } = useInitialization();

  return (
    <>
      <CssBaseline />
      <GlobalStyle />
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
            marginTop: "5vh",
            background: "linear-gradient(-10deg, #e3e3e3, #FFF)"
          }}
        >
          {loading ? (
            <PageLoading message={loadingMessage} />
          ) : loadingErrorGate ? (
            <p>Error!</p>
          ) : (
            <MainRouter
              loggedIn={loggedIn}
              loading={loading}
              isLoaded={isLoadedGate}
              message={loadingMessage}
              login={login}
            />
          )}
        </section>
      </main>
    </>
  );
};

export default App;
