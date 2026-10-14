import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  writeBatch,
  runTransaction,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Debt } from '@/types/debt'
import { allocateRepayment } from '@/utils/repayment'

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

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists() || snapshot.data().deletedAt)
      throw new Error('Debt no longer exists')
    const current = snapshot.data() as Debt
    if (
      updatedData.amount !== undefined &&
      (!Number.isFinite(updatedData.amount) ||
        updatedData.amount <= 0 ||
        updatedData.amount < (current.paidAmount ?? 0))
    )
      throw new Error('Debt amount cannot be less than the amount already paid')
    transaction.update(ref, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    })
  })

  return true
}

export const repayDebts = async (
  uid: string,
  debtIds: string[],
  amount: number | 'full',
) => {
  if (
    !debtIds.length ||
    debtIds.length > 450 ||
    new Set(debtIds).size !== debtIds.length
  )
    throw new Error('Invalid debt group size')
  const paidAt = new Date().toISOString()
  return runTransaction(db, async (transaction) => {
    const refs = debtIds.map((id) => doc(db, 'users', uid, 'debts', id))
    const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)))
    const debts = snapshots.map((snapshot) => {
      if (!snapshot.exists() || snapshot.data().deletedAt)
        throw new Error('Debt no longer exists')
      return { ...snapshot.data(), id: snapshot.id } as Debt
    })
    const requested =
      amount === 'full'
        ? debts.reduce(
            (sum, debt) =>
              sum + Math.round((debt.amount - (debt.paidAmount ?? 0)) * 100),
            0,
          ) / 100
        : amount
    const allocations = allocateRepayment(debts, requested)
    return allocations.map((allocation) => {
      const index = debtIds.indexOf(allocation.debtId)
      const updated = {
        paidAmount: allocation.paidAmount,
        payments: [
          ...(debts[index].payments ?? []),
          { amount: allocation.amount, paidAt },
        ],
      }
      transaction.update(refs[index], { ...updated, updatedAt: paidAt })
      return { id: allocation.debtId, ...updated }
    })
  })
}

export const deleteDebt = async (uid: string, debtId: string) => {
  const ref = doc(db, 'users', uid, 'debts', debtId)

  await updateDoc(ref, {
    deletedAt: new Date().toISOString(),
  })

  return true
}

export const deleteMultipleDebts = async (uid: string, debtIds: string[]) => {
  const ids = Array.from(new Set(debtIds))
  if (!ids.length || ids.length > 450)
    throw new Error('Invalid debt group size')
  const batch = writeBatch(db)
  const deletedAt = new Date().toISOString()
  for (const id of ids) {
    batch.update(doc(db, 'users', uid, 'debts', id), { deletedAt })
  }
  await batch.commit()
}
