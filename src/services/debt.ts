import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Debt } from '@/types/debt'

export const addDebt = async (uid: string, debt: Omit<Debt, 'id'>) => {
  const ref = collection(db, 'users', uid, 'debts')

  const docRef = await addDoc(ref, {
    ...debt,
    deletedAt: null,
    createdAt: new Date().toISOString(),
  })

  return { id: docRef.id }
}

export const addMultipleDebts = async (
  uid: string,
  debts: Array<Omit<Debt, 'id'>>,
) => {
  const ref = collection(db, 'users', uid, 'debts')
  const ids: string[] = []

  for (const debt of debts) {
    const docRef = await addDoc(ref, {
      ...debt,
      deletedAt: null,
      createdAt: new Date().toISOString(),
    })
    ids.push(docRef.id)
  }

  return { ids }
}

export const getDebts = async (uid: string): Promise<Debt[]> => {
  const ref = collection(db, 'users', uid, 'debts')

  const q = query(ref, where('deletedAt', '==', null))

  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Debt[]
}

export const editDebt = async (
  uid: string,
  debtId: string,
  updatedData: Partial<Omit<Debt, 'id'>>,
) => {
  const ref = doc(db, 'users', uid, 'debts', debtId)

  await updateDoc(ref, {
    ...updatedData,
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  })

  return true
}

export const deleteDebt = async (uid: string, debtId: string) => {
  const ref = doc(db, 'users', uid, 'debts', debtId)

  await updateDoc(ref, {
    deletedAt: new Date().toISOString(),
  })

  return true
}
