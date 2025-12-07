import { Debt } from '@/types/debt'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { INITIAL_DEBT } from '../shared'
import { useState } from 'react'

interface DebtFormProps {
  newDebt: Debt
  ref: React.Ref<HTMLDivElement>
  setNewDebt: React.Dispatch<React.SetStateAction<Debt>>
  handleSubmit: () => void
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>
}

const DebtForm: React.FC<DebtFormProps> = ({
  newDebt,
  ref,
  setNewDebt,
  handleSubmit,
  setShowAddForm,
}) => {
  const { t } = useTranslation()
  const [displayAmount, setDisplayAmount] = useState('')

  return (
    <>
      <div
        ref={ref}
        className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-xl border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          {newDebt.id
            ? t('debt.updateTransaction')
            : t('debt.addNewTransaction')}
        </h3>

        {/* Type Selection */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setNewDebt({ ...newDebt, type: 'lent' })}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              newDebt.type === 'lent'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <ArrowUpCircle className="w-5 h-5 inline-block mr-2" />
            {t('debt.lend')}
          </button>
          <button
            onClick={() => setNewDebt({ ...newDebt, type: 'borrowed' })}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              newDebt.type === 'borrowed'
                ? 'bg-red-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <ArrowDownCircle className="w-5 h-5 inline-block mr-2" />
            {t('debt.borrow')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('debt.form.personName')}
            value={newDebt.personName}
            onChange={(e) =>
              setNewDebt({ ...newDebt, personName: e.target.value })
            }
            className="bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={t('debt.form.amount')}
            value={displayAmount}
            onChange={(e) => {
              const value = e.target.value
              const cleaned = value
                .replace(/^0+(?=\d)/, '')
                .replace(/[^0-9]/g, '')
              setNewDebt({ ...newDebt, amount: +cleaned })
              setDisplayAmount(
                cleaned ? cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '',
              )
            }}
            className="bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <label className="text-slate-400 text-sm block mb-1">
              {t('debt.form.borrowDate')}
            </label>
            <input
              type="date"
              value={newDebt.date}
              onChange={(e) => setNewDebt({ ...newDebt, date: e.target.value })}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">
              {t('debt.form.dueDate')}
            </label>
            <input
              type="date"
              value={newDebt.dueDate}
              onChange={(e) =>
                setNewDebt({ ...newDebt, dueDate: e.target.value })
              }
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder={t('debt.form.note')}
            value={newDebt.note}
            onChange={(e) => setNewDebt({ ...newDebt, note: e.target.value })}
            className="md:col-span-2 bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleSubmit()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
          >
            {t('debt.form.save')}
          </button>
          <button
            onClick={() => {
              setShowAddForm(false)
              setNewDebt(INITIAL_DEBT)
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
          >
            {t('debt.form.cancel')}
          </button>
        </div>
      </div>
    </>
  )
}

export default DebtForm
