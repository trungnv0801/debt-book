import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Debt } from '@/types/debt'
import { useAuthContext } from './auth'

export const useDebts = () => {
  const { uid } = useAuthContext()
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getDebts = useCallback(async () => {
    if (!uid) return

    setLoading(true)
    setError(null)

    try {
      const ref = collection(db, 'users', uid, 'debts')
      const snap = await getDocs(ref)

      const list: Debt[] = snap.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as Debt[]
      setDebts(list)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    getDebts()
  }, [getDebts])

  const addDebt = useCallback(
    async (debt: Omit<Debt, 'id'>) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        const ref = collection(db, 'users', uid, 'debts')
        const docRef = await addDoc(ref, {
          ...debt,
          createdAt: new Date().toISOString(),
        })

        setDebts((prev) => [
          ...prev,
          {
            id: docRef.id,
            ...debt,
          } as Debt,
        ])
        return docRef.id
      } catch (err: any) {
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [uid],
  )
  const editDebt = useCallback(
    async (debtId: string, updated: Partial<Omit<Debt, 'id'>>) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        const ref = doc(db, 'users', uid, 'debts', debtId)

        await updateDoc(ref, {
          ...updated,
          updatedAt: new Date().toISOString(),
        })

        setDebts((prev) =>
          prev.map((d) =>
            d.id === debtId ? ({ ...d, ...updated } as Debt) : d,
          ),
        )

        return true
      } catch (err: any) {
        setError(err.message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [uid],
  )

  const deleteDebt = useCallback(
    async (debtId: string) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        const ref = doc(db, 'users', uid, 'debts', debtId)
        await deleteDoc(ref)

        setDebts((prev) => prev.filter((d) => d.id !== debtId))

        return true
      } catch (err: any) {
        setError(err.message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [uid],
  )

  return {
    debts,
    loading,
    error,
    getDebts,
    addDebt,
    editDebt,
    deleteDebt,
  }
}
