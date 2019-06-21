import React, {useState} from 'react'
import {auth} from "../firebase/firebase"

import { useDispatch } from "react-redux"
import { userSigningIn } from "../redux/actions/authActions"

import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"

export default function Login() {
  const [isLoggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState(null)

  if(isLoggingIn) return <div style={{display: "flex", justifyContent: "center", height: "100vh"}}><CircularProgress style={{ alignSelf: "center", justifySelf: "center" }}/></div>
  return (
    <>
      <Typography variant="h3" style={{ justifySelf: "center" }}>Innlogging</Typography>
      <LoginForm setLoggingIn={bool => setLoggingIn(bool)} setError={bool => setError(bool)}/>
      {error && <Typography>{error}</Typography>}
    </>
  )
}

const LoginForm = ({ setLoggingIn, setError }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()


  const login = e => {
    e.preventDefault()
    setLoggingIn(true)
    dispatch(userSigningIn())
    auth.signInWithEmailAndPassword(email, password)
      .then(() => setLoggingIn(false)).catch(err => {
        setLoggingIn(false)
        setError(err.message)
      })
  }
  
  const formStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    padding: "2vw 10vw 2vw 10vw",
    columnGap: "5vw"
  }
  const emailStyle = {
    gridColumn: "1/3"
  }
  const passwordStyle = {
    gridColumn: "3/5"
  }
  const submitStyle = {
    gridColumn: "1/5",
    justifySelf: "center",
    marginTop: "1vw"
  }

  const handleEmail = e => {
    setEmail(e.target.value)
  }

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
  return(
    <form style={formStyle} onSubmit={login} autoComplete="new-password">
      <TextField 
        style={emailStyle} 
        type="text"
        label="E-post"
        name="email"
        value={email}
        onChange={e => handleEmail(e)}
        autoComplete="new-password"
        />
      <TextField 
        style={passwordStyle}
        type="password"
        label="Passord"
        name="password"
        value={password}
        onChange={e => handlePassword(e)} 
        minLength="8"
        autoComplete="new-password"
        />
      <input style={submitStyle} type="submit" value="Logg inn"/>
    </form>
  )
}