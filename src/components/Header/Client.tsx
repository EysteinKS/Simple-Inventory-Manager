import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import styled, { css } from "styled-components";
import { UserName, ClientImage } from "./styles";
import CloudStatus from "./CloudStatus";
import LocationModal from "../profile/LocationModal";

const LocationSelector = () => {
  const locationName = useSelector(
    (state: RootState) => state.auth.location.name
  );
  const locationLogo = useSelector(
    (state: RootState) => state.auth.location.logoUrl
  );
  const hasLocations = useSelector(
    (state: RootState) => state.auth.user.locations.length > 1
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    hasLocations && setModalOpen(true);
  };

  return (
    <>
      <StyledWrapper>
        <ClientWrapper hasLocations={hasLocations} onClick={openModal}>
          {locationLogo && window.innerWidth > 500 ? (
            <ClientImage src={locationLogo} alt={locationName} />
          ) : (
            <UserName>{locationName || "LAGER"}</UserName>
          )}
        </ClientWrapper>
        <CloudStatus />
      </StyledWrapper>
      {isModalOpen && (
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  place-items: center;
  align-self: center;
  border-left: 1px solid #0003;
`;

interface ClientWrapperProps {
  hasLocations: boolean;
}

const ClientWrapper = styled.div<ClientWrapperProps>`
  ${props =>
    props.hasLocations &&
    css`
      cursor: pointer;
    `}
`;

export default LocationSelector;
