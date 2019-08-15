import {
  auth,
  firestore,
  tempFirestore,
  connectToTemp,
  disconnectFromTemp
} from "./firebase"

//USERS

const createNewUser = () => {
  //USE AUTH TO SIGN UP NEW USER
  //USE FIRESTORE TO ADD USER TO USERS
}

const resetUserPassword = () => {
  //IS IT POSSIBLE TO SEND RESET REQUEST TO OTHER USER?
}

const updateUserData = () => {
  //USE FIRESTORE TO UPDATE USER DATA
}

export const users = {
  createNewUser,
  resetUserPassword,
  updateUserData
}

//USERS END

//CLIENTS

const createNewClient = () => {
  //ADD CLIENT TO LIST IN FIRESTORE
}

const updateClientData = () => {
  //UPDATE CLIENT DATA IN FIRESTORE
}

const initializeClientFirestore = () => {
  //USE FIREBASE CONFIG TO INITIALIZE TEMPFIRESTORE
}

export const clients = {
  createNewClient,
  updateClientData,
  initializeClientFirestore
}

//CLIENTS END