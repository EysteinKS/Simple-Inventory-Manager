import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import { shouldLog } from "../../constants/util";
import { changeUserLocation } from "../../firebase/user";
import { resetRedux } from "../../redux/actions";
import { clearLocalStorage } from "../../redux/middleware/localStorage";
import { navigate } from "@reach/router";
import styled from "styled-components";


const ChangeLocation = () => {
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

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <form
      style={{ display: "grid" }}
      onSubmit={event => event.preventDefault()}
    >
      <h3 style={{ textAlign: "center" }}>Avdeling</h3>
      <select
        style={{ placeSelf: "center" }}
        value={location}
        onChange={e => setLocation(e.target.value)}
      >
        {locations.map((l, i) => (
          <option key={"location_" + i} value={l}>
            {clients[l]}
          </option>
        ))}
      </select>
      <StyledEditButton onClick={changeLocation}>
        Endre avdeling
      </StyledEditButton>
    </form>
  );
};

const StyledEditButton = styled.button`
  width: 20%;
  height: 3em;
  justify-self: center;
  background-color: #fff;
  margin-bottom: 2em;
`;

export default ChangeLocation;