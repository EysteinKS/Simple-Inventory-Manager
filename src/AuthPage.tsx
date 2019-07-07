import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import History from "./pages/History";

interface RoutePageProps extends RouteComponentProps {
  component: FC
}

const RoutePage: FC<RoutePageProps> = ({ component: Component, ...rest }) => (
  <Component {...rest}/>
)

const AuthPage: FC = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <Router primary={false}>
        <RoutePage component={Products} path={routes.HOME} />
        <RoutePage component={Orders} path={routes.ORDERS} />
        <RoutePage component={Sales} path={routes.SALES} />
        <RoutePage component={History} path={routes.HISTORY} />
      </Router>
    </div>
  );
};

export default AuthPage