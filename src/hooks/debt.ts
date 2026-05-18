import { useState, useCallback } from 'react'
import { addDebt, getDebts, editDebt, deleteDebt } from '@/services/debt'
import { Debt } from '@/types/debt'
import { useAuthContext } from './auth'

export const useDebts = () => {
  const { uid } = useAuthContext()
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebts = useCallback(async () => {
    if (!uid) return

    setLoading(true)
    setError(null)

    try {
      const list = await getDebts(uid)
      setDebts(list as Debt[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [uid])

  const handleAddDebt = useCallback(
    async (debt: Omit<Debt, 'id'>) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        const res = await addDebt(uid, debt)

        setDebts((prev) => [
          ...prev,
          {
            id: res.id,
            ...debt,
          } as Debt,
        ])

        return res.id
      } catch (err: any) {
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [uid],
  )

  const handleEditDebt = useCallback(
    async (debtId: string, updated: Partial<Omit<Debt, 'id'>>) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        await editDebt(uid, debtId, updated)

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

  const handleDeleteDebt = useCallback(
    async (debtId: string) => {
      if (!uid) return

      setLoading(true)
      setError(null)

      try {
        await deleteDebt(uid, debtId)

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
    getDebts: fetchDebts,
    addDebt: handleAddDebt,
    editDebt: handleEditDebt,
    deleteDebt: handleDeleteDebt,
  }
}
