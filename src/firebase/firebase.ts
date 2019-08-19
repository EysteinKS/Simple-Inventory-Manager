import * as firebase from 'firebase/app';
import { FirebaseAppConfig } from "@firebase/app-types"
import { FirebaseFirestore } from "@firebase/firestore-types"
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseAuthConfig } from "../config"

type FirebaseApp = firebase.app.App
let secondary: FirebaseApp
let secondaryFirestore: FirebaseFirestore

let temp: FirebaseApp
let tempFirestore: FirebaseFirestore

export const appsAmount = firebase.apps.length

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseAuthConfig);
}

export const initializeLocation = (config: FirebaseAppConfig) => {
  secondary = firebase.initializeApp(config, "secondary")
  secondaryFirestore = secondary.firestore()
  //secondaryAuth = secondary.auth()
}

export const connectToTemp = (config: FirebaseAppConfig) => {
  temp = firebase.initializeApp(config, "temp")
  tempFirestore = temp.firestore()
}

export const disconnectFromTemp = () => {
  temp.delete()
}

export const doSignOut = () => {
  firebase.auth().signOut()
  secondary.delete()
}

const firestore = firebase.firestore();
const auth = firebase.auth();

export {
  firebase,
  firestore,
  auth,
  secondaryFirestore,
  tempFirestore
}