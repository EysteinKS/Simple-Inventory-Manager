import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import useLoadedGate from "./useLoadedGate";
import {
  loadUser,
  setLocationName,
  setLocationColor,
  setLocationLogo,
  setAllLastChanged,
  userSignedOut,
  setNewChanges
} from "../redux/actions/authActions";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, initializeLocation } from "../firebase/firebase";
import { RootState, LastChanged } from "../redux/types"
import { ClientData } from "../firebase/types"
import { getInventory } from  "../redux/middleware/firestore"
import { parseDate } from "../constants/util"
import { listenToUpdates } from "../firebase/Subscription";

export default function useInitialization() {
  const [user, initializingUser] = useAuthState(auth);
  const dispatch = useDispatch();
  const authIsLoaded = useSelector((state: RootState) => state.auth.isLoaded);
  const authCurrentLocation = useSelector((state: RootState) => state.auth.user.currentLocation);
  const userLoggingOut = useSelector((state: RootState) => state.auth.loggingOut);
  const [isLoadingUser, setLoadingUser] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...")

  useEffect(() => {
    if(!user && userLoggingOut){
      dispatch(userSignedOut())
    } else if (user && userLoggingOut) {
      setLoadingMessage("Logging out...")
    }
  }, [dispatch, user, userLoggingOut])

  //USED TO SHOW TIME TAKEN UNTIL THE PAGE IS LOADED
  /* const [timer, setTimer] = useState(false)
  useEffect(() => {
    if(initializingUser || loadingMessage === "Logging in..." || userLoggingOut){
      if(!timer){
        setTimer(true)
        console.time("Time until interactive")
      }
    } else if (!user && !initializingUser) {
      if(timer){
        setTimer(false)
        console.timeEnd("Time until interactive")
      }
    }
  }, [user, initializingUser, userLoggingOut, loadingMessage, timer]) */

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
  async function fetchLocationData(location: string | null) {
    await firestore.doc(`Clients/${location}`).get()
      .then(async res => {
        const data = res.data() as ClientData;
        dispatch(setLocationName(data.name));
        dispatch(setLocationLogo(data.logoUrl));
        dispatch(setLocationColor(data.primaryColor));

        const lastChangedToDate = (data: LastChanged) => {
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
      const onChange = () => dispatch(setNewChanges())
      listenToUpdates(authCurrentLocation, onChange)
    }
    //eslint-disable-next-line
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