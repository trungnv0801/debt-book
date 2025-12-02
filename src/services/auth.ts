import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)
  return {
    uid: user.uid,
    email: user.email,
    ...userSnap.data(),
  }
}
