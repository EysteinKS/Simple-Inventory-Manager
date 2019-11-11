import React from "react";
import styled from "styled-components";
import { resetPassword } from "../api/auth";
import { navigate } from "@reach/router";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

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
          setMessage("E-post for passordbytte har blitt sendt");
        },
        () => {
          setMessage("Ugyldig adresse, vennligst prøv igjen");
        }
      );
    } else {
      setMessage("Ugyldig adresse, vennligst prøv igjen");
    }
  };

  return (
    <div
      style={{
        margin: "5vh 10vw 10vh 10vw",
        display: "grid",
        placeItems: "center"
      }}
    >
      <BackWrapper>
        <BackButton onClick={() => navigate("/")}>
          {"Gå tilbake"}
        </BackButton>
      </BackWrapper>
      <Heading>Glemt Passord</Heading>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Skriv e-postadresse"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input type="submit" value="Nullstill passord" />
      </form>
    </div>
  );
};

const BackWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
`;

const BackButton = styled.p`
  cursor: pointer;
  text-decoration-line: underline;
`;

const Heading = styled.h1``;

export default ForgotPassword;
