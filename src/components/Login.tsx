import React, { useState, FormEvent, ChangeEvent } from "react";
import { TLogin } from "../hooks/useInitialization";
import styled from "styled-components";
import Spinner from "./util/Spinner";
import { InputWithIcon } from "../styles/form";
import Icons from "./util/Icons";
import { MAIN, BRIGHT } from "../styles/colors";
import ForgotPassword from "./ForgotPassword";
import useDemo from "../hooks/useDemo";

type IProps = {
  doLogin: TLogin;
};

type LoginViews = "login" | "forgot";

export default function Login({ doLogin }: IProps) {
  const [view, setView] = useState("login" as LoginViews);
  const { demoLogin } = useDemo();

  return (
    <>
      <LoginWrapper>
        <LogoWrapper>
          <Icons.Products /> Lagerstyring - Innlogging
        </LogoWrapper>
        {view === "login" && (
          <LoginForm doLogin={doLogin} forgotPw={() => setView("forgot")} />
        )}
        {view === "forgot" && <ForgotPassword back={() => setView("login")} />}
      </LoginWrapper>
      <DemoWrapper>
        <p>Prøv en offline demo:</p>
        <LoginButton
          onClick={() => {
            doLogin("demo@demo.com", "Demo1234", () => {});
            demoLogin();
          }}
        >
          Demo
        </LoginButton>
      </DemoWrapper>
    </>
  );
}

const LoginWrapper = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 1em;
  background: #f9f9f9;
  border: 2px solid #0002;
  display: grid;
  grid-template-rows: 35px auto;
`;

const DemoWrapper = styled.div`
  width: 250px;
  background: #f9f9f9;
  border: 2px solid #0002;
  margin: 1em auto;
  padding: 1em;
  display: grid;
  grid-template-rows: 1fr 1fr;

  p {
    margin-top: 0;
    text-align: center;
  }
`;

const LogoWrapper = styled.div`
  border-bottom: 2px solid #0002;
  font-size: 18px;
  font-weight: 700;
  color: #000b;

  svg {
    color: ${MAIN};
  }
`;

type TLoginForm = {
  doLogin: TLogin;
  forgotPw: () => void;
};

const LoginForm = ({ doLogin, forgotPw }: TLoginForm) => {
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

  //https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908
  return (
    <StyledForm onSubmit={handleLogin} autoComplete="new-password">
      <ErrorMessage>{error}</ErrorMessage>
      <InputsWrapper>
        <InputWithIcon
          autoFocus
          type="text"
          placeholder="E-post"
          name="email"
          value={email}
          onChange={handleEmail}
          autoComplete="new-password"
        >
          <Icons.Email />
        </InputWithIcon>
        <InputWithIcon
          type="password"
          placeholder="Passord"
          name="password"
          value={password}
          onChange={handlePassword}
          data-minlength="8"
          autoComplete="new-password"
        >
          <Icons.Key />
        </InputWithIcon>
      </InputsWrapper>
      <LoginButton disabled={loggingIn}>
        {loggingIn ? <Spinner size="30px" /> : "Logg inn"}
      </LoginButton>
      <ForgotPasswordLink onClick={forgotPw}>Glemt passord?</ForgotPasswordLink>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 5vh 5vh;
`;

const InputsWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-self: center;
`;

const ErrorMessage = styled.p`
  color: #c72222de;
  text-align: center;
`;

const ForgotPasswordLink = styled.p`
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  color: #666;
  justify-self: center;
  margin: 0;
  align-self: center;
`;

const LoginButton = styled.button`
  border-radius: 0;
  font-size: 16px;
  display: flex;
  justify-content: center;
  background: ${BRIGHT};

  :hover {
    cursor: pointer;
    color: #000a;
    background: ${MAIN};
    border: none;
  }
`;
