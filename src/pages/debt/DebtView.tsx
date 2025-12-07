import { useEffect, useState } from 'react'
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

const DebtView: React.FC = () => {
  const { t } = useTranslation()

  const { debts, loading, addDebt, getDebts, deleteDebt } = useDebts()
  const [showAddForm, setShowAddForm] = useState(false)

  const [newDebt, setNewDebt] = useState<Debt>(INITIAL_DEBT)

  const lentDebts = debts.filter((d) => d.type === TYPE_LENT)
  const borrowedDebts = debts.filter((d) => d.type === TYPE_BORROWED)

  const handleAddDebt = async () => {
    if (newDebt.personName && newDebt.amount && newDebt.date) {
      await addDebt({
        type: newDebt.type,
        personName: newDebt.personName,
        amount: newDebt.amount,
        date: newDebt.date,
        dueDate: newDebt.dueDate,
        note: newDebt.note,
      })
      setNewDebt(INITIAL_DEBT)
      setShowAddForm(false)
    }
  }

  const handleDeleteDebt = (id: string) => deleteDebt(id)

  useEffect(() => {
    getDebts()
  }, [getDebts])

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

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            {t('debt.addTransaction')}
          </button>
        </div>

        {showAddForm && (
          <DebtForm
            handleAddDebt={handleAddDebt}
            setShowAddForm={setShowAddForm}
            newDebt={newDebt}
            setNewDebt={setNewDebt}
          />
        )}

        <DebtList
          handleDeleteDebt={handleDeleteDebt}
          lentDebts={lentDebts}
          borrowedDebts={borrowedDebts}
        />
      </div>
    </div>
  )
}

export default DebtView
