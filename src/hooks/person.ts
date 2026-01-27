import { useState, useCallback } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthContext } from './auth'
import { Person } from '@/types/person'

export const usePersons = () => {
  const { uid } = useAuthContext()
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)

  const getPersons = useCallback(async () => {
    if (!uid) return
    setLoading(true)

    const ref = collection(db, 'users', uid, 'persons')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)

    setPersons(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Person[])
    setLoading(false)
  }, [uid])

  const addPerson = async (name: string) => {
    if (!uid) return
    const ref = collection(db, 'users', uid, 'persons')
    const docRef = await addDoc(ref, {
      name: name.trim(),
      createdAt: new Date().toISOString(),
    })

    setPersons((prev) => [...prev, { id: docRef.id, name }])
    return docRef.id
  }

  const editPerson = async (id: string, name: string) => {
    if (!uid) return
    const ref = doc(db, 'users', uid, 'persons', id)
    await updateDoc(ref, { name })

    setPersons((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const canDeletePerson = async (personId: string) => {
    const debtsRef = collection(db, 'users', uid!, 'debts')
    const q = query(debtsRef, where('personId', '==', personId))
    const snap = await getDocs(q)
    return snap.empty
  }

  const deletePerson = async (id: string) => {
    if (!uid) return

    const canDelete = await canDeletePerson(id)
    if (!canDelete) return false

    const ref = doc(db, 'users', uid, 'persons', id)
    await deleteDoc(ref)

    setPersons((prev) => prev.filter((p) => p.id !== id))
    return true
  }

  return {
    persons,
    loading,
    getPersons,
    addPerson,
    editPerson,
    canDeletePerson,
    deletePerson,
  }
}
