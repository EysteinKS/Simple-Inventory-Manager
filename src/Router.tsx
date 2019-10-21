import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import { PageLoading, NoTextLoading } from "./components/util/PageLoading";
import TableSkeleton from "./components/util/TableSkeleton";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";

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
  setMessage: (message: string) => void;
}

export const NonAuthRouter: FC<NonAuthRouteProps> = ({ setMessage }) => {
  return (
    <Router primary={false}>
      <NonAuthPage setMessage={setMessage} default />
    </Router>
  );
};

interface NonAuthProps {
  setMessage: (message: string) => void;
  default: boolean;
}

const NonAuthPage: FC<NonAuthProps> = ({ setMessage }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <Login setMessage={setMessage} />
    </div>
  );
};

interface MainRouterProps {
  loggedIn: boolean;
  loading: boolean;
  isLoaded: boolean;
  message: string;
  setMessage: (message: string) => void;
}

const MainRouter = ({
  loggedIn,
  isLoaded,
  message,
  setMessage
}: MainRouterProps) => {
  if (loggedIn && isLoaded) {
    return <AuthRouter />;
  } else if (loggedIn && !isLoaded) {
    return <PageLoading message={message} />;
  } else {
    return <NonAuthRouter setMessage={setMessage} />;
  }
};

export default MainRouter;
