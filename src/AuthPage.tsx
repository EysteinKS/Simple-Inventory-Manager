import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Loans from "./pages/Loans";

interface RoutePageProps extends RouteComponentProps {
  component: FC
}

const RoutePage: FC<RoutePageProps> = ({ component: Component, ...rest }) => (
  <Component {...rest}/>
)

const AuthPage: FC = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return (
    <Router primary={false}>
      <RoutePage component={Products} path={routes.HOME} />
      <RoutePage component={Orders} path={routes.ORDERS} />
      <RoutePage component={Sales} path={routes.SALES} />
      <RoutePage component={Loans} path={routes.LOANS} />
      <RoutePage component={History} path={routes.HISTORY} />
      <RoutePage component={Admin} path={routes.ADMIN} />
    </Router>
  );
};

export default AuthPage