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
  secondary = firebase.initializeApp(config, "secondary")
  secondaryFirestore = secondary.firestore()
  secondaryAuth = secondary.auth()
}

export const doSignOut = () => {
  firebase.auth().signOut()
  //https://firebase.google.com/docs/reference/js/firebase.app.App.html
  secondary.delete().then(() => {
    secondary = null
    secondaryFirestore = null
    secondaryAuth = null
  })
}

const firestore = firebase.firestore();
const auth = firebase.auth();

export {
  firestore,
  auth,
  secondaryFirestore,
  secondaryAuth
}