import { auth } from "../firebase/firebase";
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
