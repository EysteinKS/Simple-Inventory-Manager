import { auth, firestore } from "../firebase/firebase";
import * as firebase from "firebase/app";
import "firebase/auth";

export const resetPassword = (
  email: string,
  onSuccess: () => void,
  onError: () => void
) => {
  auth
    .sendPasswordResetEmail(email)
    .then(() => onSuccess())
    .catch(() => onError());
};

export const setNewPassword = (
  oldPwd: string,
  newPwd: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  const user = auth.currentUser;
  if (user) {
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email as string,
      oldPwd
    );
    user
      .reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        user
          .updatePassword(newPwd)
          .then(() => onSuccess())
          .catch(() => onError("En feil oppsto, vennligst prøv igjen"));
      })
      .catch(() => onError("Feil passord oppgitt"));
  }
};

export const updateProductVisibility = (visible: boolean) => {
  let uid = auth.currentUser && auth.currentUser.uid;
  return firestore.doc(`Users/${uid}`).update({
    "settings.isInactiveVisible": visible
  });
};

export const updateTooltipVisibility = (visible: boolean) => {
  let uid = auth.currentUser && auth.currentUser.uid;
  return firestore.doc(`Users/${uid}`).update({
    "settings.showTooltips": visible
  });
};

export const updateUseAutoSave = (bool: boolean) => {
  let uid = auth.currentUser && auth.currentUser.uid;
  return firestore.doc(`Users/${uid}`).update({
    "settings.useAutoSave": bool
  });
};

export const updateTimeToAutoSave = (time: number) => {
  let uid = auth.currentUser && auth.currentUser.uid;
  return firestore.doc(`Users/${uid}`).update({
    "settings.timeToAutoSave": time
  });
};
