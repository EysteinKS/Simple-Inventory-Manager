import React, { FC } from "react";
import Header from "./components/Header";

import useInitialization from "./hooks/useInitialization";
import MainRouter from "./Router";
import { PageLoading } from "./components/util/PageLoading";
import GlobalStyle from "./styles/globalStyle";
import styled from "styled-components";
import { tallDevice } from "./styles/device";
import { NotificationHandler } from "./components/util/Notification";
import useRedirect from "./hooks/useRedirect";

const App: FC = () => {
  useRedirect(["localhost"], "lager.eystein.dev");

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
        <NotificationHandler />
      </AppWrapper>
    </>
  );
};

const AppWrapper = styled.main`
  height: 100vh;
  overflow: hidden;
  background: #e4e4e4;
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
