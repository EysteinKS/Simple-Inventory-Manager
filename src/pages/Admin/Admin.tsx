/* eslint-disable */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import { navigate } from "@reach/router";
import {
  createNewClient,
  updateClientData,
  initializeClientFirestore,
  createNewUser
} from "../../firebase/admin";
import { demoConfig } from "../../config";
import ColorPicker from "../../components/util/ColorPicker";
import {
  addNotification,
  notifications
} from "../../redux/actions/notificationActions";
import styled from "styled-components";

/*
TODO:

ADD LIST OF REQUESTED USERS TO CONFIRM

ADD LIST OF ALL CLIENTS
ADD FUNCTION TO CREATE NEW CLIENTS

*/

const Admin = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  if (currentUser.role !== "admin") {
    return <NonAdmin />;
  }

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <h1 style={{ textAlign: "center" }}>ADMIN</h1>
      <TestButtons />
      {/* <Clients /> */}
      <Users />
      <ColorPicker />
    </div>
  );
};

const NonAdmin = () => {
  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <p>This page is only available to administrators</p>
      <button onClick={() => navigate("/")}>Go home</button>
    </div>
  );
};

const Clients = () => {
  const createNew = () => createNewClient("Demo", "Demo");
  const addData = () =>
    updateClientData("Demo", {
      firebaseConfig: demoConfig
    });
  const initialize = () => initializeClientFirestore("Demo", demoConfig);

  return (
    <div>
      <button onClick={createNew}>Add Demo Client</button>
      <button onClick={addData}>Add data to client</button>
      <button onClick={initialize}>Initialize client firestore</button>
    </div>
  );
};

const NewClient = () => {
  return <div></div>;
};

const Users = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [client, setClient] = useState("");

  //TODO
  //GET LIST OF CLIENTS
  //VERIFY USER CREATION BASED ON ADMIN

  const createUser = () =>
    createNewUser(email, password, [firstName, lastName], client);

  return (
    <form
      onSubmit={e => e.preventDefault()}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        padding: "1em"
      }}
    >
      <p>E-post</p>
      <input
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <p>Passord</p>
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <p>Fornavn</p>
      <input
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <p>Etternavn</p>
      <input
        type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <p>Klient</p>
      <input
        type="text"
        value={client}
        onChange={e => setClient(e.target.value)}
      />
      <button style={{ gridColumn: "1/3" }} onClick={createUser}>
        Create new user
      </button>
    </form>
  );
};

const TestButtons = () => {
  const dispatch = useDispatch();

  return (
    <TestButtonsWrapper>
      <button
        onClick={() => dispatch(addNotification(notifications.newChanges()))}
      >
        Vis varsling 1
      </button>
      <button
        onClick={() => dispatch(addNotification(notifications.savedChanges()))}
      >
        Vis varsling 2
      </button>
      <button
        onClick={() => dispatch(addNotification(notifications.addedChange()))}
      >
        Vis varsling 3
      </button>
      <button
        onClick={() => dispatch(addNotification(notifications.savingError()))}
      >
        Vis varsling 4
      </button>
    </TestButtonsWrapper>
  );
};

const TestButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 50px;
`;

export default Admin;
