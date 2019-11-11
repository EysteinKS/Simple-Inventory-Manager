import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import { PageLoading, NoTextLoading } from "./components/util/PageLoading";
import TableSkeleton from "./components/util/TableSkeleton";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword"
import { TLogin } from "./hooks/useInitialization";

const Products = React.lazy(() => import("./pages/Products"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Sales = React.lazy(() => import("./pages/Sales"));
const History = React.lazy(() => import("./pages/History"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Loans = React.lazy(() => import("./pages/Loans"));
const Profile = React.lazy(() => import("./pages/Profile"));

interface RoutePageProps extends RouteComponentProps {
  component: FC;
  fallback: FC<any>;
  fbprops?: any;
}

const RoutePage: FC<RoutePageProps> = ({
  component: Component,
  fallback: Fallback,
  fbprops,
  ...rest
}) => (
  <React.Suspense fallback={<Fallback {...fbprops} />}>
    <Component {...rest} />
  </React.Suspense>
);

export const AuthRouter: FC = () => {
  //https://github.com/reach/router/issues/242#issuecomment-467082358
  return (
    <Router primary={false}>
      <RoutePage
        component={Products}
        path={routes.HOME}
        fallback={TableSkeleton}
        fbprops={{ title: "Produkter" }}
      />
      <RoutePage
        component={Orders}
        path={routes.ORDERS}
        fallback={TableSkeleton}
        fbprops={{ title: "Bestillinger" }}
      />
      <RoutePage
        component={Sales}
        path={routes.SALES}
        fallback={TableSkeleton}
        fbprops={{ title: "Salg" }}
      />
      <RoutePage
        component={Loans}
        path={routes.LOANS}
        fallback={TableSkeleton}
        fbprops={{ title: "Utlån" }}
      />
      <RoutePage
        component={History}
        path={routes.HISTORY}
        fallback={NoTextLoading}
      />
      <RoutePage
        component={Profile}
        path={routes.PROFILE}
        fallback={NoTextLoading}
      />
      <RoutePage
        component={Admin}
        path={routes.ADMIN}
        fallback={NoTextLoading}
      />
      <RoutePage component={NotFound} default fallback={NoTextLoading} />
    </Router>
  );
};

interface NonAuthRouteProps {
  login: TLogin;
}

export const NonAuthRouter: FC<NonAuthRouteProps> = ({ login }) => {
  return (
    <Router primary={false}>
      <RoutePage 
        component={ForgotPassword}
        path={routes.FORGOT_PASSWORD}
        fallback={NoTextLoading}
      />
      <NonAuthPage login={login} default/>
    </Router>
  );
};

interface NonAuthProps {
  login: TLogin;
  default: boolean;
}

const NonAuthPage: FC<NonAuthProps> = ({ login }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login doLogin={login}/>
    </div>
  );
};

interface MainRouterProps {
  loggedIn: boolean;
  loading: boolean;
  isLoaded: boolean;
  message: string;
  login: TLogin;
}

const MainRouter = ({
  loggedIn,
  isLoaded,
  message,
  login
}: MainRouterProps) => {
  if (loggedIn && isLoaded) {
    return <AuthRouter />;
  } else if (loggedIn && !isLoaded) {
    return <PageLoading message={message} />;
  } else {
    return <NonAuthRouter login={login}/>;
  }
};

export default MainRouter;
