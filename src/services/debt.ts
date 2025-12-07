import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Debt } from '@/types/debt'

export const addDebt = async (uid: string, debt: Omit<Debt, 'id'>) => {
  const ref = collection(db, 'users', uid, 'debts')

  const docRef = await addDoc(ref, {
    ...debt,
    createdAt: new Date().toISOString(),
  })

  return { id: docRef.id }
}

export const getDebts = async (uid: string) => {
  const ref = collection(db, 'users', uid, 'debts')
  const snap = await getDocs(ref)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

export const editDebt = async (
  uid: string,
  debtId: string,
  updatedData: Partial<Omit<Debt, 'id'>>,
) => {
  const ref = doc(db, 'users', uid, 'debts', debtId)

  await updateDoc(ref, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  })

  return true
}

export const deleteDebt = async (uid: string, debtId: string) => {
  const ref = doc(db, 'users', uid, 'debts', debtId)

  await deleteDoc(ref)

  return true
}
