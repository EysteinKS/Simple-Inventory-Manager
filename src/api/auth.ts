import { auth } from "../firebase/firebase"

export const resetPassword = (email: string, onSuccess: () => void, onError: () => void) => {
  auth.sendPasswordResetEmail(email)
    .then(() => onSuccess())
    .catch(() => onError())
}

export const setNewPassword = (password: string, onSuccess: () => void, onError: () => void) => {
  const user = auth.currentUser
  if(user){
    user.updatePassword(password)
      .then(() => onSuccess())
      .catch(() => onError())
  }
}