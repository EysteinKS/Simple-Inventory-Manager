import { auth, firestore } from "./firebase";

export const changeUserLocation = (location: string) =>
  new Promise((res, rej) => {
    const uid = auth.currentUser && auth.currentUser.uid;
    firestore
      .doc(`Users/${uid}`)
      .update({ currentLocation: location })
      .then(() => res())
      .catch(err => rej(err));
  });
