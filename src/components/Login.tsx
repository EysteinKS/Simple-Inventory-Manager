import React, { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { userLoggingIn } from "../redux/actions/authActions";
import { auth } from "../firebase/firebase";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

type TLogin = {
  setMessage: (message: string) => void;
};

export default function Login({ setMessage }: TLogin) {
  const [error, setError] = useState(null as boolean | null);
  const dispatch = useDispatch();
  const onLogin = (m: string) => {
    setMessage(m);
    dispatch(userLoggingIn());
  };

  return (
    <>
      <Typography variant="h3" style={{ justifySelf: "center" }}>
        Innlogging
      </Typography>
      <LoginForm message={onLogin} setError={bool => setError(bool)} />
      {error && <Typography>{error}</Typography>}
    </>
  );
}

type TLoginForm = {
  message: (m: string) => void;
  setError: (bool: boolean) => void;
};

const LoginForm = ({ message, setError }: TLoginForm) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    message("Logging in...");
    auth.signInWithEmailAndPassword(email, password).catch(err => {
      setError(err.message);
    });
  };

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    padding: "2vw 10vw 2vw 10vw",
    columnGap: "5vw"
  };
  const emailStyle = {
    gridColumn: "1/3"
  };
  const passwordStyle = {
    gridColumn: "3/5"
  };
  const submitStyle = {
    gridColumn: "1/5",
    justifySelf: "center",
    marginTop: "1vw"
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
  return (
    <form style={formStyle} onSubmit={login} autoComplete="new-password">
      <TextField
        autoFocus
        style={emailStyle}
        type="text"
        label="E-post"
        name="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleEmail(e)}
        autoComplete="new-password"
      />
      <TextField
        style={passwordStyle}
        type="password"
        label="Passord"
        name="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handlePassword(e)}
        data-minlength="8"
        autoComplete="new-password"
      />
      <input style={submitStyle} type="submit" value="Logg inn" />
    </form>
  );
};
