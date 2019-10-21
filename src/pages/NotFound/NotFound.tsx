import React from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";

//TODO
//CREATE 404 PAGE
//CONNECT TO ROUTER

const Styled404 = styled.div`
  height: 94vh;
  display: grid;
  grid-template-columns: 1fr;
  place-content: center;
  place-items: center;
`;

const StyledButton = styled.button`
  border: none;
  background: none;
  width: 50%;
  height: 10vh;
  font-size: 2ch;
`;

export default () => {
  return (
    <Styled404>
      404 Denne siden finnes ikke!
      <StyledButton onClick={() => navigate("/")}>
        Gå til hovedside
      </StyledButton>
    </Styled404>
  );
};
