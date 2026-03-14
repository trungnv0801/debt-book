import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircle } from 'lucide-react'
import { useDebts } from '@/hooks/debt'
import { Debt, DebtSearch } from '@/types'
import Loading from '@/components/common/Loading'
import DebtForm from './components/DebtForm'
import DebtList from './components/DebtList'
import Summary from './components/Summary'
import {
  groupDebtsByPersonWithOffset,
  INITIAL_DEBT,
  INITIAL_DEBT_SEARCH,
} from './shared'
import { usePersons } from '@/hooks/person'
import SearchForm from './components/SearchForm'

export default function DebtView() {
  const { t } = useTranslation()
  const formRef = useRef<HTMLDivElement>(null)
  const { debts, loading, addDebt, getDebts, deleteDebt, editDebt } = useDebts()
  const [showForm, setShowForm] = useState(false)
  const [newDebt, setNewDebt] = useState<Debt>(INITIAL_DEBT)
  const personsHook = usePersons()
  const { persons, getPersons } = personsHook
  const [search, setSearch] = useState<DebtSearch>(INITIAL_DEBT_SEARCH)

  const personMap = useMemo(
    () => Object.fromEntries(persons.map((p) => [p.id, p.name])),
    [persons],
  )

  const filteredDebts = useMemo(() => {
    return debts.filter((debt) => {
      if (search.name) {
        const personName = personMap[debt.personId]?.toLowerCase() ?? ''
        if (!personName.includes(search.name.toLowerCase())) return false
      }
      if (search.note) {
        if (!debt.note?.toLowerCase().includes(search.note.toLowerCase()))
          return false
      }
      if (search.date && debt.date < search.date) return false
      if (search.dueDate && debt.date > search.dueDate) return false
      return true
    })
  }, [debts, search, personMap])

  const { lentGroups, borrowedGroups } = useMemo(
    () => groupDebtsByPersonWithOffset(filteredDebts, personMap),
    [filteredDebts, personMap],
  )

  const handleSubmit = async () => {
    const { id, personId, amount, date, type, dueDate, note } = newDebt

    if (!personId || !amount || !date) return

    const payload = {
      type,
      personId: personId.trim(),
      amount,
      date,
      dueDate,
      note: note.trim(),
    }

    const action = id ? editDebt(id, payload) : addDebt(payload)
    await action

    setNewDebt(INITIAL_DEBT)
    setShowForm(false)
  }

  const handleDeleteDebt = (id: string) => deleteDebt(id)

  const handleEditDebt = (debt: Debt) => {
    setNewDebt(debt)
    setShowForm(true)
  }

  useEffect(() => {
    getDebts()
  }, [getDebts])

  useEffect(() => {
    getPersons()
  }, [getPersons])

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm, newDebt.id])

  return (
    <div className="relative">
      {loading && <Loading />}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('debt.title')}
          </h1>
          <p className="text-slate-400">{t('debt.subtitle')}</p>
        </div>

        <Summary lentDebts={lentGroups} borrowedDebts={borrowedGroups} />

        <SearchForm value={search} onChange={setSearch} />

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            {t('debt.addTransaction')}
          </button>
        </div>

        {showForm && (
          <DebtForm
            ref={formRef}
            handleSubmit={handleSubmit}
            setShowAddForm={setShowForm}
            newDebt={newDebt}
            setNewDebt={setNewDebt}
            personsHook={personsHook}
          />
        )}

        <DebtList
          lentGroups={lentGroups}
          borrowedGroups={borrowedGroups}
          handleDeleteDebt={handleDeleteDebt}
          handleEditDebt={handleEditDebt}
        />
      </div>
    </div>
  )
}
