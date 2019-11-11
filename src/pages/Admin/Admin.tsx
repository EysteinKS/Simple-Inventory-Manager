/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { navigate } from "@reach/router";
import {
  createNewClient,
  updateClientData,
  initializeClientFirestore,
  createNewUser
} from "../../firebase/admin";
import { demoConfig } from "../../config";

/*
TODO:

ADD REDIRECT OR SHOW BLANK PAGE IF USER IS NOT ADMIN

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
      ADMIN
      <Clients />
      <Users />
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
  const createUser = () =>
    createNewUser("demo@demo.com", "Demo123", ["Demo", "User"], "Demo");

  return (
    <div>
      <button onClick={createUser}>Create new user</button>
    </div>
  );
};

const User = () => {
  return <div></div>;
};

const NewUser = () => {
  return <div></div>;
};

export default Admin;