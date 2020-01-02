import { useState, useEffect } from "react";
import store from "store";
import { useDispatch, useSelector } from "react-redux";
import useLoadedGate from "./useLoadedGate";
import {
  loadUser,
  setLocationName,
  setLocationColor,
  setLocationLogo,
  setAllLastChanged,
  userSignedOut,
  setNewChanges,
  userLoggingIn
} from "../redux/actions/authActions";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, initializeLocation } from "../firebase/firebase";
import { RootState, LastChanged } from "../redux/types";
import { ClientData } from "../firebase/types";
import { getInventory } from "../redux/middleware/firestore";
import { parseDate } from "../constants/util";
import { listenToUpdates } from "../firebase/Subscription";
import {
  addNotification,
  notifications
} from "../redux/actions/notificationActions";
import useDemo from "./useDemo";
import { clearLocalStorage } from "../redux/middleware/localStorage";

export type TLogin = (
  email: string,
  password: string,
  onError: () => void
) => void;

export default function useInitialization() {
  const [user, initializingUser] = useAuthState(auth);
  const { isDemo } = useDemo();
  const stateIsDemo = useSelector((state: RootState) => state.auth.isDemo);
  const dispatch = useDispatch();
  const authIsLoaded = useSelector((state: RootState) => state.auth.isLoaded);
  const authCurrentLocation = useSelector(
    (state: RootState) => state.auth.user.currentLocation
  );
  const userLoggingOut = useSelector(
    (state: RootState) => state.auth.loggingOut
  );
  const [isLoadingUser, setLoadingUser] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (!user && userLoggingOut) {
      dispatch(userSignedOut());
    } else if (user && userLoggingOut) {
      setLoadingMessage("Logging out...");
    }
  }, [dispatch, user, userLoggingOut]);

  //FETCH USER
  useEffect(() => {
    if (user && !isLoadingUser && !authIsLoaded && !userLoggingOut) {
      const prevSessionIsDemo = isDemo();
      if (prevSessionIsDemo && !stateIsDemo) {
        store.set("demo", false);
        auth.signOut();
        clearLocalStorage();
      } else {
        setLoadingUser(true);
        setLoadingMessage("Loading user...");
        dispatch(loadUser(user.uid));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authIsLoaded, userLoggingOut, isDemo, stateIsDemo]);

  //FETCH LOCATION
  async function fetchLocationData(location: string | null) {
    await firestore
      .doc(`Clients/${location}`)
      .get()
      .then(async res => {
        const data = res.data() as ClientData;
        dispatch(setLocationName(data.name));
        dispatch(setLocationLogo(data.logoUrl));
        dispatch(setLocationColor(data.primaryColor));

        const lastChangedToDate = (data: LastChanged) => {
          let updated = { ...data };
          updated.global = parseDate(updated.global);
          for (let k in updated.sections) {
            updated.sections[k] = parseDate(updated.sections[k]);
          }
          return updated;
        };
        let updatedLastChanged = lastChangedToDate(data.lastChanged);
        dispatch(setAllLastChanged(updatedLastChanged));

        initializeLocation(data.firebaseConfig);
      });
  }

  //Load location when user is loaded
  useEffect(() => {
    if (authIsLoaded) {
      setLoadingUser(false);
      setLoadingMessage("Loading location...");
      fetchLocationData(authCurrentLocation).then(() => {
        dispatch(getInventory(setLoadingMessage));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsLoaded, authCurrentLocation]);

  const [isLoadingGate, isLoadedGate, loadingErrorGate] = useLoadedGate();

  const loading =
    isLoadingGate || initializingUser || isLoadingUser || userLoggingOut;

  //Configure subscription when logged in
  useEffect(() => {
    if (isLoadedGate) {
      setLoadingMessage("Loaded!");
      const onChange = () => {
        dispatch(setNewChanges());
        dispatch(addNotification(notifications.newChanges()));
      };
      listenToUpdates(authCurrentLocation, onChange);
    }
    //eslint-disable-next-line
  }, [isLoadedGate]);

  const login: TLogin = (email, password, onError) => {
    setLoadingMessage("Logging in...");
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(userLoggingIn());
      })
      .catch(err => {
        onError();
      });
  };

  return {
    loading: loading,
    isLoadedGate,
    loadingErrorGate,
    loadingMessage,
    setLoadingMessage,
    login,
    loggedIn: Boolean(user)
  };
}
