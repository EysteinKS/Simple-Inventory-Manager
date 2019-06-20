import React, {useState, useRef} from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
import {auth} from "../firebase/firebase"

import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"

export default () => {
  //const [user, initialising, error] = useAuthState(auth)
  const [isLoggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const emailEl = useRef(null)
  const passwordEl = useRef(null)

  const login = e => {
    e.preventDefault()
    setLoggingIn(true)
    auth.signInWithEmailAndPassword(email, password)
      .then(() => setLoggingIn(false)).catch(err => {
        setLoggingIn(false)
        setError(err.message)
      })
  }

  const LoginForm = () => {
    const formStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      padding: "2vw 10vw 2vw 10vw"
    }
    const labelStyle = {
      gridColumn: "2/3"
    }
    const inputStyle = {
      gridColumn: "3/4"
    }
    const submitStyle = {
      gridColumn: "1/5",
      justifySelf: "center",
      marginTop: "1vw"
    }

    const handleEmail = e => {
      //if (!e.isTrusted) return
      setEmail(e.target.value)
      emailEl.current.focus()
    }

    const handlePassword = e => {
      //if (!e.isTrusted) return
      setPassword(e.target.value)
      passwordEl.current.focus()
    }

    //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
    return(
      <form style={formStyle} onSubmit={login} autoComplete="new-password" key="login-form">
        <TextField 
          style={inputStyle} 
          key="email-input"
          inputRef={emailEl}
          type="text"
          label="E-post"
          value={email} 
          onChange={handleEmail}
          autoComplete="new-password"
          />
        <TextField 
          style={inputStyle}
          key="password-input"
          inputRef={passwordEl}
          type="password"
          label="Passord"
          value={password}
          onChange={handlePassword} 
          minLength="8"
          autoComplete="new-password"
          />
        <input style={submitStyle} type="submit" value="Logg inn"/>
      </form>
    )
  }

  if(isLoggingIn) return <CircularProgress style={{ placeSelf: "center" }}/>
  return (
    <>
      <Typography variant="h3" style={{ justifySelf: "center" }}>Innlogging</Typography>
      <LoginForm/>
      {error && <Typography>{error}</Typography>}
    </>
  )
}
