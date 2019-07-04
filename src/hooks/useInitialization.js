import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import useLoadedGate from "./useLoadedGate";
import {
  loadUser,
  setLocationName,
  setLocationColor,
  setLocationLogo,
  setAllLastChanged,
  userSignedOut
} from "../redux/actions/authActions";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, initializeLocation } from "../firebase/firebase";
import { getInventory } from  "../redux/middleware/firestore"
import { parseDate } from "../constants/util"

export default function useInitialization() {
  const [user, initializingUser] = useAuthState(auth);
  const dispatch = useDispatch();
  const authIsLoaded = useSelector(state => state.auth.isLoaded);
  const authCurrentLocation = useSelector(state => state.auth.currentLocation);
  const userLoggingOut = useSelector(state => state.auth.loggingOut);
  const [isLoadingUser, setLoadingUser] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...")

  useEffect(() => {
    if(!user && userLoggingOut){
      dispatch(userSignedOut())
    } else if (user && userLoggingOut) {
      setLoadingMessage("Logging out...")
    }
  }, [dispatch, user, userLoggingOut])

  const [timer, setTimer] = useState(false)
  useEffect(() => {
    if(initializingUser || loadingMessage === "Logging in..." || userLoggingOut){
      if(!timer){
        setTimer(true)
        console.log("Time until interactive...")
        console.time("Time until interactive")
      }
    } else if (!user && !initializingUser){
      if(timer){
        setTimer(false)
        console.timeEnd("Time until interactive")
      }
    }
  }, [user, initializingUser, userLoggingOut, loadingMessage, timer])

  //FETCH USER
  useEffect(() => {
    if (user && !isLoadingUser && !authIsLoaded && !userLoggingOut) {
      setLoadingUser(true);
      setLoadingMessage("Loading user...")
      dispatch(loadUser(user.uid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authIsLoaded, userLoggingOut]);

  //FETCH LOCATION
  async function fetchLocationData(location) {
    await firestore.doc(`Clients/${location}`).get()
      .then(async res => {
        const data = res.data();
        dispatch(setLocationName(data.name));
        dispatch(setLocationLogo(data.logoUrl));
        dispatch(setLocationColor(data.primaryColor));

        const lastChangedToDate = (data) => {
          let updated = {...data}
          updated.global = parseDate(updated.global)
          for (let k in updated.sections){
            updated.sections[k] = parseDate(updated.sections[k])
          }
          return updated
        }
        let updatedLastChanged = lastChangedToDate(data.lastChanged)
        dispatch(setAllLastChanged(updatedLastChanged))

        initializeLocation(data.firebaseConfig);
      });
  }

  //LOAD LOCATION WHEN USER IS LOADED
  useEffect(() => {
    if (authIsLoaded) {
      setLoadingUser(false);
      setLoadingMessage("Loading location...")
      fetchLocationData(authCurrentLocation).then(() => {
        dispatch(getInventory(setLoadingMessage))
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsLoaded, authCurrentLocation]);

  const [isLoadingGate, isLoadedGate, loadingErrorGate] = useLoadedGate();
  
  const loading = (
    isLoadingGate || 
    initializingUser || 
    isLoadingUser || 
    userLoggingOut
  )

  useEffect(() => {
    if(isLoadedGate) {
      setLoadingMessage("Loaded!")
      setTimer(false)
      console.timeEnd("Time until interactive")
    }
  }, [isLoadedGate])

  return {
    loading: loading,
    isLoadedGate,
    loadingErrorGate,
    loadingMessage,
    setLoadingMessage,
    loggedIn: Boolean(user), 
  }

}