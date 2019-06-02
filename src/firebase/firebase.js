import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseAuthConfig } from "../config"

let secondary, secondaryFirestore, secondaryAuth
export const appsAmount = firebase.apps.length

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseAuthConfig);
}

export const initializeLocation = (config) => {
  console.log(firebase.apps)
  secondary = firebase.initializeApp(config, "secondary")
  secondaryFirestore = secondary.firestore()
  secondaryAuth = secondary.auth()
  console.log(firebase.apps)
}


const firestore = firebase.firestore();
const auth = firebase.auth();

export {
  firestore,
  auth,
  secondaryFirestore,
  secondaryAuth
}