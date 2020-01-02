import React from "react";
import store from "store";
import { auth, doSignOut } from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import Subscription from "../../firebase/Subscription";
import {
  UserWrapper,
  UserName,
  ProfileWrapper,
  UserDropdownContent
} from "./styles";
import { RootState, AuthState } from "../../redux/types";
import Icons from "../util/Icons";
import { shouldLog } from "../../constants/util";
import { clearLocalStorage } from "../../redux/middleware/localStorage";
import { resetRedux } from "../../redux/actions";
import { useAuthState } from "react-firebase-hooks/auth";
import useLocation from "../../hooks/useLocation";
import { navigate } from "@reach/router";
import { DropdownList, DropdownListItem, ListSplitter } from "../util/Dropdown";

const User = () => {
  const [user] = useAuthState(auth);
  const authUser = useSelector((state: RootState) => state.auth);

  return (
    <UserWrapper>
      {user ? <LoggedIn authUser={authUser} /> : <NotLoggedIn />}
      <UserDropdownContent>
        {user ? <LoggedInDropdown /> : <div>Hello world!</div>}
      </UserDropdownContent>
    </UserWrapper>
  );
};

type TLoggedIn = {
  authUser: AuthState;
};

const LoggedIn = ({ authUser }: TLoggedIn) => {
  const { location } = useLocation();
  const currentPath = location.pathname;
  const isCurrent = React.useMemo(() => currentPath === "/profile", [
    currentPath
  ]);
  return (
    <>
      <ProfileWrapper current={isCurrent}>
        <UserName>{authUser.user.firstName}</UserName>
        <Icons.Profile />
      </ProfileWrapper>
    </>
  );
};

const LoggedInDropdown = () => {
  const dispatch = useDispatch();
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
  const handleLogout = () => {
    if (store.get("demo")) {
      store.set("demo", false);
    }
    shouldLog("Signing out");
    Subscription.getInstance().unsubscribe();
    doSignOut();
    clearLocalStorage();
    shouldLog("Resetting redux");
    dispatch(resetRedux());
  };
  return (
    <DropdownList>
      <DropdownListItem
        onClick={e => {
          e.currentTarget.blur();
          goToProfile();
        }}
      >
        <p>Profil</p>
        <Icons.Gear />
      </DropdownListItem>
      <ListSplitter />
      <DropdownListItem
        onClick={e => {
          e.currentTarget.blur();
          handleLogout();
        }}
      >
        <p>Logg ut</p>
        <Icons.Logout />
      </DropdownListItem>
    </DropdownList>
  );
};

const NotLoggedIn = () => (
  <>
    <UserName style={{ gridColumn: "1/5" }}>Logg inn</UserName>
  </>
);

export default User;
