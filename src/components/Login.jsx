import React, {useState} from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
import {auth} from "../firebase/firebase"

import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"

export default () => {
  //const [user, initialising, error] = useAuthState(auth)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = e => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .then().catch(err => setError(err.message))
  }

  const LoginForm = () => {
    //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
    return(
      <form onSubmit={login} autoComplete="off">
        <input type="hidden" value="avoid-autocomplete"/>
        <label htmlFor="email">E-post</label>
        <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
        <label htmlFor="password">Passord</label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} minLength="8" autoComplete="new-password"/>
        <input type="submit" value="Logg inn"/>
      </form>
    )
  }

  return (
    <>
      <LoginForm/>
      {error && <Typography>{error}</Typography>}
    </>
  )
}
