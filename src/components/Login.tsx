import React, { useState, FormEvent, ChangeEvent } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { TLogin } from "../hooks/useInitialization";
import styled from "styled-components";
import { navigate } from "@reach/router";

type IProps = {
  doLogin: TLogin;
};

//TODO
//ADD BUTTON AND PAGE FOR PASSWORD RESETTING

export default function Login({ doLogin }: IProps) {
  return (
    <>
      <Typography variant="h3" style={{ justifySelf: "center" }}>
        Innlogging
      </Typography>
      <LoginForm doLogin={doLogin} />
    </>
  );
}

type TLoginForm = {
  doLogin: TLogin;
};

const LoginForm = ({ doLogin }: TLoginForm) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null as string | null);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    setError(null);
    setLoggingIn(true);
    e.preventDefault();
    doLogin(email, password, () => {
      setLoggingIn(false);
      setError("Brukernavn eller passord er ugyldig");
    });
  };

  const emailStyle = {
    gridColumn: "1/3",
    gridRow: "2/3"
  };
  const passwordStyle = {
    gridColumn: "3/5",
    gridRow: "2/3"
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleForgotPW = () => {
    navigate("/forgot");
  };

  //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
  return (
    <StyledForm onSubmit={handleLogin} autoComplete="new-password">
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
      <FormBottom>
        {loggingIn ? (
          <CircularProgress style={{ placeSelf: "center" }} />
        ) : (
          <LoginButton>Logg inn</LoginButton>
        )}
        <ForgotPassword onClick={handleForgotPW}>Glemt passord?</ForgotPassword>
      </FormBottom>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 7vh);
  padding: 2vh 10vw;
  column-gap: 5vw;
`;

const ErrorMessage = styled.p`
  color: #c72222de;
  text-align: center;
  grid-column: span 4;
`;

const FormBottom = styled.div`
  margin-top: 1em;
  grid-column: span 4;
  grid-row: 3/4;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  & > * {
    margin: 0.5em;
  }
`;

const ForgotPassword = styled.p`
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  color: #666;
  justify-self: center;
`;

const LoginButton = styled.button`
  border-radius: 0;
  justify-self: center;
  width: auto;
  padding: 0.5em 1em;
  font-size: 16px;
`;
