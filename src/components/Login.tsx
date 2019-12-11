import React, { useState, FormEvent, ChangeEvent } from "react";
import { TLogin } from "../hooks/useInitialization";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Spinner from "./util/Spinner";
import { TextInput } from "../styles/form";

type IProps = {
  doLogin: TLogin;
};

export default function Login({ doLogin }: IProps) {
  return (
    <>
      <LoginHeader>Innlogging</LoginHeader>
      <LoginForm doLogin={doLogin} />
    </>
  );
}

const LoginHeader = styled.h1`
  justify-self: center;
`;

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
      <ErrorMessage>{error}</ErrorMessage>
      <InputsWrapper>
        <TextInput
          autoFocus
          type="text"
          placeholder="E-post"
          name="email"
          value={email}
          onChange={handleEmail}
          autoComplete="new-password"
        />
        <TextInput
          type="password"
          placeholder="Passord"
          name="password"
          value={password}
          onChange={handlePassword}
          data-minlength="8"
          autoComplete="new-password"
        />
      </InputsWrapper>
      <LoginButton disabled={loggingIn}>
        {loggingIn ? <Spinner size="30px" /> : "Logg inn"}
      </LoginButton>
      <ForgotPassword onClick={handleForgotPW}>Glemt passord?</ForgotPassword>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3vh 5vh 5vh 5vh;
  padding: 2vh 10vw;
`;

const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ErrorMessage = styled.p`
  color: #c72222de;
  text-align: center;
  margin: 0;
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
  font-size: 16px;
  display: flex;
  justify-content: center;
`;
