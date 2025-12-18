import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  validatePassword,
} from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      email,
      createdAt: new Date(),
    })
  }

  const data = (await getDoc(ref)).data()

  return {
    uid: user.uid,
    email: user.email,
    ...data,
  }
}

export const checkUserExists = async (uid: string) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists()
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const resetPasswordUser = async (email: string) => {
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin

  await sendPasswordResetEmail(auth, email, {
    url: `${redirectUrl}/login`,
  })
}

export const verifyResetPasswordCode = async (oobCode: string) => {
  return verifyPasswordResetCode(auth, oobCode)
}

export const confirmResetPassword = async (
  oobCode: string,
  newPassword: string,
) => {
  return confirmPasswordReset(auth, oobCode, newPassword)
}

export const getPasswordRules = async () => {
  const validation = await validatePassword(auth, '')
  return validation.passwordPolicy
}
