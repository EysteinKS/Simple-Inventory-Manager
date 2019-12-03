import React, { FC } from "react";
import Header from "./components/Header";
import CssBaseline from "@material-ui/core/CssBaseline";

import useInitialization from "./hooks/useInitialization";
import MainRouter from "./Router";
import { PageLoading } from "./components/util/PageLoading";
import GlobalStyle from "./styles/globalStyle";
import styled from "styled-components";
import { tallDevice } from "./styles/device";

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
      <AppWrapper>
        <Header locationIsLoaded={isLoadedGate} />
        <SectionWrapper>
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
        </SectionWrapper>
      </AppWrapper>
    </>
  );
};

const AppWrapper = styled.main`
  height: 100vh;
  overflow: hidden;
`;

const SectionWrapper = styled.section`
  height: 94.5vh;
  overflow-x: hidden;
  overflow-y: overlay;
  margin-top: 5.5vh;
  background: #e4e4e4;
  ${tallDevice(`
    height: 96vh;
    margin-top: 4vh;
  `)}
`;

export default App;
