import React from "react";
import { useSelector } from "react-redux";
import LinkWrapper from "../util/LinkWrapper";
import { RootState } from "../../redux/types";
import styled from "styled-components";
import { UserName, ClientImage } from "./styles";
import CloudStatus from "./CloudStatus";

const LocationSelector = () => {
  const locationName = useSelector(
    (state: RootState) => state.auth.location.name
  );
  const locationLogo = useSelector(
    (state: RootState) => state.auth.location.logoUrl
  );

  return (
    <StyledWrapper>
      <LinkWrapper linkTo="/">
        {locationLogo && window.innerWidth > 500 ? (
          <ClientImage src={locationLogo} alt={locationName} />
        ) : (
          <UserName>{locationName || "LAGER"}</UserName>
        )}
      </LinkWrapper>
      <CloudStatus />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  place-items: center;
  align-self: center;
`;

export default LocationSelector;
