import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Loans from "./pages/Loans";
import Login from "./components/Login";
import NotFound from "./pages/NotFound";
import { PageLoading } from "./App";

interface RoutePageProps extends RouteComponentProps {
  component: FC
}

const RoutePage: FC<RoutePageProps> = ({ component: Component, ...rest }) => (
  <Component {...rest}/>
)

export const AuthRouter: FC = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return (
    <Router primary={false}>
      <RoutePage component={Products} path={routes.HOME} />
      <RoutePage component={Orders} path={routes.ORDERS} />
      <RoutePage component={Sales} path={routes.SALES} />
      <RoutePage component={Loans} path={routes.LOANS} />
      <RoutePage component={History} path={routes.HISTORY} />
      <RoutePage component={Admin} path={routes.ADMIN} />
      <RoutePage component={NotFound} default/>
    </Router>
  );
};

interface NonAuthRouteProps {
  setMessage: (message: string) => void
}

export const NonAuthRouter: FC<NonAuthRouteProps> = ({setMessage}) => {
  return (
    <Router primary={false}>
      <NonAuthPage setMessage={setMessage} default/>
    </Router>
  )
}

interface NonAuthProps {
  setMessage: (message: string) => void
  default: boolean
}

const NonAuthPage: FC<NonAuthProps> = ({ setMessage }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login setMessage={setMessage}/>
    </div>
  );
};

interface MainRouterProps {
  loggedIn: boolean
  loading: boolean
  isLoaded: boolean
  message: string
  setMessage: (message: string) => void
}

const MainRouter = ({loggedIn, isLoaded, message, setMessage}: MainRouterProps) => {
  if(loggedIn && isLoaded){
    return <AuthRouter/>
  } else if(loggedIn && !isLoaded) {
    return <PageLoading message={message}/>
  } else {
    return <NonAuthRouter setMessage={setMessage}/>
  }
}

export default MainRouter
