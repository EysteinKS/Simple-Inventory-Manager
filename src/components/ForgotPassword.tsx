import React from "react";
import styled from "styled-components";
import { resetPassword } from "../api/auth";
import { InputButton, InputWithIcon } from "../styles/form";
import Icons from "./util/Icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import { ERROR, SUCCESS } from "../styles/colors";

interface ForgotPasswordProps {
  back: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ back }) => {
  const userEmail = useSelector((state: RootState) => state.auth.user.email);
  const [email, setEmail] = React.useState(userEmail);
  const [message, setMessage] = React.useState("");
  const [hasError, setHasError] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim
    );
    const isValidEmail = regex.test(email);
    if (isValidEmail) {
      resetPassword(
        email,
        () => {
          setHasError(false);
          setMessage("E-post for passordbytte har blitt sendt");
          setIsSent(true);
        },
        () => {
          setHasError(true);
          setMessage("Ugyldig adresse, vennligst prøv igjen");
        }
      );
    } else {
      setHasError(true);
      setMessage("Ugyldig adresse, vennligst prøv igjen");
    }
  };

  return (
    <ForgotWrapper hasMessage={message.length > 1 && !isSent}>
      <HeaderWrapper>
        <InputButton onClick={back}>
          <Icons.ArrowBack />
        </InputButton>
        <Heading>Glemt Passord</Heading>
      </HeaderWrapper>
      {message.length > 1 && <Message error={hasError}>{message}</Message>}
      {!isSent && (
        <form onSubmit={handleSubmit}>
          <InputWithIcon
            type="text"
            placeholder="Skriv e-postadresse"
            value={email}
            onChange={e => setEmail(e.target.value)}
          >
            <Icons.Email />
          </InputWithIcon>
          <SubmitButton type="submit" value="Nullstill passord" />
        </form>
      )}
    </ForgotWrapper>
  );
};

const ForgotWrapper = styled.div<{ hasMessage: boolean }>`
  display: grid;
  place-items: center;
  padding-top: 0.5em;
  grid-template-rows: ${props =>
    props.hasMessage ? "5vh auto 10vh" : "5vh 10vh"};
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;

  button > svg {
    height: 24px;
    width: 24px;
  }
`;

const Heading = styled.h3`
  padding: 0;
  margin: 0;
  justify-self: center;
  align-self: center;
  color: #000b;
`;

const Message = styled.p<{ error: boolean }>`
  color: ${props => (props.error ? ERROR : SUCCESS)};
`;

const SubmitButton = styled.input`
  height: 100%;
  width: 100%;
`;

export default ForgotPassword;
