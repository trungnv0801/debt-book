import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Debt, PersonDebtGroup } from '@/types'
import DebtCard from './DebtCard'
import { formatCurrency } from '../shared'
import { useTranslation } from 'react-i18next'

interface PersonDebtGroupItemProps {
  group: PersonDebtGroup
  color: 'green' | 'red'
  onDelete: (id: string) => void
  onEdit: (debt: Debt) => void
}

const PersonDebtGroupItem: React.FC<PersonDebtGroupItemProps> = ({
  group,
  color,
  onDelete,
  onEdit,
}) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div
        className={`absolute inset-0 opacity-5 pointer-events-none ${
          color === 'green'
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        }`}
      />

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-full px-5 py-4 flex justify-between items-center hover:bg-slate-700/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
              color === 'green'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
            }`}
          >
            {(group.personName?.charAt(0) ?? '?').toUpperCase()}
          </div>

          <div className="text-left">
            <h3 className="text-lg font-bold text-white mb-0.5">
              {group.personName}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-base font-bold ${
                  color === 'green' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(group.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 transition-transform duration-300`}
        >
          <div className="text-xs text-slate-400 font-medium">
            {t('person.transactions', { count: group.debts.length })}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
          {group.debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              color={color}
              onDelete={() => onDelete(debt.id)}
              onEdit={() => onEdit(debt)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonDebtGroupItem
