import React from "react";
import { navigate } from "@reach/router";
import styled from "styled-components";

const StyledWrapper = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const LinkWrapper: React.FC<{ linkTo: string }> = ({ linkTo, children }) => {
  return (
    <StyledWrapper onClick={() => navigate(linkTo)}>{children}</StyledWrapper>
  );
};

export default LinkWrapper;
