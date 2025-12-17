import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircle } from 'lucide-react'
import { useDebts } from '@/hooks/debt'
import { Debt } from '@/types'
import Loading from '@/components/common/Loading'
import DebtForm from './components/DebtForm'
import DebtList from './components/DebtList'
import Summary from './components/Summary'
import { INITIAL_DEBT } from './shared'
import { TYPE_BORROWED, TYPE_LENT } from './shared/constant'
import { PersonSummary } from './components/PersonSummary'

export default function DebtView() {
  const { t } = useTranslation()
  const formRef = useRef<HTMLDivElement>(null)
  const { debts, loading, addDebt, getDebts, deleteDebt, editDebt } = useDebts()
  const [showForm, setShowForm] = useState(false)

  const [newDebt, setNewDebt] = useState<Debt>(INITIAL_DEBT)

  const lentDebts = debts.filter((d) => d.type === TYPE_LENT)
  const borrowedDebts = debts.filter((d) => d.type === TYPE_BORROWED)

  const handleSubmit = async () => {
    const { id, personName, amount, date, type, dueDate, note } = newDebt

    if (!personName || !amount || !date) return

    const payload = {
      type,
      personName: personName.trim(),
      amount,
      date,
      dueDate,
      note,
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

        <Summary lentDebts={lentDebts} borrowedDebts={borrowedDebts} />

        <PersonSummary lentDebts={lentDebts} borrowedDebts={borrowedDebts} />

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
          />
        )}

        <DebtList
          handleDeleteDebt={handleDeleteDebt}
          handleEditDebt={handleEditDebt}
          lentDebts={lentDebts}
          borrowedDebts={borrowedDebts}
        />
      </div>
    </div>
  )
}
