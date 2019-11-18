import React from "react";
import { auth, doSignOut } from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import Subscription from "../../firebase/Subscription";
import { UserWrapper, UserName, LogoutButton, ProfileWrapper } from "./styles";
import { RootState, AuthState } from "../../redux/types";
import { Dispatch } from "redux";
import LinkWrapper from "../util/LinkWrapper";
import Icons from "../util/Icons";
import { shouldLog } from "../../constants/util";
import { clearLocalStorage } from "../../redux/middleware/localStorage";
import { resetRedux } from "../../redux/actions";
import { useAuthState } from "react-firebase-hooks/auth";
import Exit from "@material-ui/icons/ExitToApp";
import { Tooltip } from "../util/HoverInfo";
import useLocation from "../../hooks/useLocation";
import { navigate } from "@reach/router";

const User = () => {
  const [user] = useAuthState(auth);
  const authUser = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const unsub = () => {
    const sub = Subscription.getInstance();
    sub.unsubscribe();
  };

  return (
    <UserWrapper>
      {user ? (
        <LoggedIn authUser={authUser} dispatch={dispatch} unsub={unsub} />
      ) : (
        <NotLoggedIn />
      )}
    </UserWrapper>
  );
};

type TLoggedIn = {
  authUser: AuthState;
  dispatch: Dispatch<any>;
  unsub: () => void;
};

const LoggedIn = ({ authUser, dispatch, unsub }: TLoggedIn) => {
  const { location } = useLocation();
  const currentPath = location.pathname;
  const isCurrent = React.useMemo(() => currentPath === "/profile", [
    currentPath
  ]);
  const goToProfile = () => {
    if (!isCurrent) {
      navigate("/profile");
    }
  };
  return (
    <>
      <ProfileWrapper onClick={goToProfile} current={isCurrent}>
        <UserName>{authUser.user.firstName}</UserName>
        <Icons.AccountCircle />
      </ProfileWrapper>
      <LogoutButton
        onClick={() => {
          shouldLog("Signing out");
          unsub();
          doSignOut();
          clearLocalStorage();
          shouldLog("Resetting redux");
          dispatch(resetRedux());
        }}
        data-tip
        data-for={"logout_button"}
      >
        <Exit />
        <Tooltip handle={"logout_button"}>Logg ut</Tooltip>
      </LogoutButton>
    </>
  );
};

const NotLoggedIn = () => (
  <>
    <UserName style={{ gridColumn: "1/5" }}>Logg inn</UserName>
  </>
);

export default User;
