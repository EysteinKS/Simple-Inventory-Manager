import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import useMargin from "../../hooks/useMargin";
import useAuthLocation from "../../hooks/useAuthLocation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import { firestore } from "../../firebase/firebase";
import { shouldLog } from "../../constants/util";
import { changeUserLocation } from "../../firebase/user";
import { resetRedux } from "../../redux/actions";
import { clearLocalStorage } from "../../redux/middleware/localStorage";
import { navigate } from "@reach/router";
import styled from "styled-components";
import Icons from "../util/Icons";
import Spinner from "../util/Spinner";
ReactModal.setAppElement("#root");

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const modalWidth = 350;
  const sideMargin = useMargin(modalWidth, 7);

  const { color, secondary } = useAuthLocation();

  const currentLocation = useSelector(
    (state: RootState) => state.auth.user.currentLocation
  );

  const locations = useSelector(
    (state: RootState) => state.auth.user.locations
  );

  const [location, setLocation] = useState(currentLocation);
  const dispatch = useDispatch();

  const [isLoaded, setLoaded] = useState(false);
  const [clients, setClients] = useState({} as { [key: string]: string });
  useEffect(() => {
    firestore
      .doc("Clients/clients")
      .get()
      .then(res => {
        const data = res.data() as any;
        setClients(data.byID);
        setLoaded(true);
      })
      .catch(err => shouldLog("Error getting clients", err));
  }, []);

  const changeLocation = async () => {
    try {
      await changeUserLocation(location);
      await dispatch(resetRedux());
      await clearLocalStorage();
      navigate("/");
      window.location.reload();
    } catch (err) {
      shouldLog(err);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Change Location"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
        },
        content: {
          top: "30vh",
          bottom: "auto",
          left: `${sideMargin}px`,
          right: `${sideMargin}px`,
          padding: "0",
          background: "white",
          width: `${modalWidth}px`,
          display: "grid",
          gridTemplateRows: "50px 50px auto",
          border: `7px solid ${color}`
        }
      }}
    >
      <ModalHeader bckColor={color as string}>
        <ModalTitle>Bytt Avdeling</ModalTitle>
        <ModalButton onClick={onClose}>
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent bckColor={secondary}>
        {isLoaded ? (
          <SelectLocation
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            {locations.map(loc => (
              <LocationOption key={"location_" + loc} value={loc}>
                {clients[loc]}
              </LocationOption>
            ))}
          </SelectLocation>
        ) : (
          <Spinner size="24px" />
        )}
        <ModalButton
          disabled={location === currentLocation}
          onClick={changeLocation}
        >
          <Icons.Enter />
        </ModalButton>
      </ModalContent>
    </ReactModal>
  );
};

interface BckColorProps {
  bckColor: string;
}

const ModalHeader = styled.div<BckColorProps>`
  display: grid;
  grid-template-columns: 6fr 1fr;
  border-bottom: 2px solid #0002;
  ${props => `
    background: ${props.bckColor};
  `}
`;

const ModalTitle = styled.h3`
  margin: 0;
  align-self: center;
  justify-self: start;
  padding-left: 0.5em;
  color: #000b;
`;

const ModalContent = styled.div<BckColorProps>`
  display: grid;
  grid-template-columns: 6fr 1fr;
  ${props => `background: ${props.bckColor}`}
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: #000;
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
    color: #0008;
  }
  :disabled {
    color: #0003;
    cursor: not-allowed;
    background: #0004;
  }
`;

const SelectLocation = styled.select`
  height: 100%;
  width: 100%;
  border: none;
  border-radius: 0px;
`;

const LocationOption = styled.option``;

export default LocationModal;
