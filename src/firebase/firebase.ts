import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseAuthConfig } from "../config";
import { shouldLog } from "../constants/util";

type FirebaseApp = firebase.app.App;
let secondary: FirebaseApp;
let secondaryFirestore: firebase.firestore.Firestore;

let temp: FirebaseApp;
let tempFirestore: firebase.firestore.Firestore;

export const appsAmount = firebase.apps.length;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseAuthConfig);
}

export const initializeLocation = (config: any) => {
  secondary = firebase.initializeApp(config, "secondary");
  secondaryFirestore = secondary.firestore();
  //secondaryAuth = secondary.auth()
};

export const connectToTemp = async (config: any) => {
  shouldLog("Connecting to temp firebase with config: ", config);
  temp = await firebase.initializeApp(config, "temp");
  shouldLog(temp.name);
  tempFirestore = await temp.firestore();
};

export const disconnectFromTemp = () => {
  shouldLog("Disconnecting from temp firebase");
  temp.delete();
};

export const doSignOut = () => {
  firebase.auth().signOut();
  secondary.delete();
};

const firestore = firebase.firestore();
const auth = firebase.auth();

export { firebase, firestore, auth, secondaryFirestore, tempFirestore };
