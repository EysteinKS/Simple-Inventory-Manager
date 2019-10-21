import React from "react"
import { auth, doSignOut } from "../../firebase/firebase"
import { useSelector, useDispatch } from "react-redux"
import Subscription from "../../firebase/Subscription"
import { UserWrapper } from "./styles"
import { RootState, AuthState } from "../../redux/types"
import { Dispatch } from "redux"
import LinkWrapper from "../util/LinkWrapper"
import Icons from "../util/Icons"
import Typography from "@material-ui/core/Typography"
import { shouldLog } from "../../constants/util"
import { clearLocalStorage } from "../../redux/middleware/localStorage"
import { resetRedux } from "../../redux/actions"
import { useAuthState } from "react-firebase-hooks/auth"

const UserSelector = () => {
  const [user] = useAuthState(auth)
  const authUser = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const unsub = () => {
    const sub = Subscription.getInstance()
    sub.unsubscribe()
  }

  return(
    <UserWrapper>
      {user ? <LoggedIn authUser={authUser} dispatch={dispatch} unsub={unsub}/> : <NotLoggedIn/>}
    </UserWrapper>
  )
}

type TLoggedIn = {
  authUser: AuthState
  dispatch: Dispatch<any>
  unsub: () => void
}

const LoggedIn = ({ authUser, dispatch, unsub }: TLoggedIn) => 
  <>
    <LinkWrapper linkTo="/profile">
      <Icons.AccountCircle fontSize="large"/>
    </LinkWrapper>
    <div style={{ justifySelf: "left", display: "flex" }}>
      <><Typography>{authUser.user.firstName}&nbsp;</Typography></>
      <><Typography>{authUser.user.lastName}</Typography></>
    </div>
    {/*<Notifications/>*/}
    <button onClick={() => {
      shouldLog("Signing out")
      unsub()
      doSignOut()
      clearLocalStorage()
      shouldLog("Resetting redux")
      dispatch(resetRedux())
    }} style={{height: "4vh", padding: "0"}}>Logg ut</button>
  </>

const NotLoggedIn = () => 
  <>
    <Typography style={{gridColumn: "1/5"}}>Logg inn</Typography>
  </>

export default UserSelector