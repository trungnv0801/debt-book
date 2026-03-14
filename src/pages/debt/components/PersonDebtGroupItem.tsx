import { useState } from 'react'
import { ChevronDown, ArrowLeftRight } from 'lucide-react'
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

  const showAllDebts = group.isOffset ? [...group.debts] : group.debts

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
        className="relative w-full px-4 py-4 flex items-center gap-3 hover:bg-slate-700/30 transition-colors duration-200"
      >
        <div
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-bold text-base shadow-lg ${
            color === 'green'
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
              : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
          }`}
        >
          {(group.personName?.charAt(0) ?? '?').toUpperCase()}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {group.personName}
            </h3>
            <span className="shrink-0 text-xs text-slate-500 font-medium whitespace-nowrap">
              · {t('person.transactions', { count: showAllDebts.length })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span
              className={`text-sm font-bold shrink-0 ${
                group.isOffset && group.netAmount === 0
                  ? 'line-through text-slate-500'
                  : color === 'green'
                    ? 'text-green-400'
                    : 'text-red-400'
              }`}
            >
              {formatCurrency(group.totalAmount)}
            </span>

            {group.isOffset && group.netAmount > 0 && (
              <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                {'→ '}
                <span
                  className={`font-bold ${color === 'green' ? 'text-green-300' : 'text-red-300'}`}
                >
                  {formatCurrency(group.netAmount)}
                </span>
              </span>
            )}

            {group.isOffset && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-medium shrink-0">
                <ArrowLeftRight className="w-3 h-3" />
                {t('debt.offsetApplied', {
                  amount: formatCurrency(group.offsetAmount),
                })}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
          {group.isOffset && (
            <div className="flex items-center gap-2 text-xs text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-3">
              <ArrowLeftRight className="w-4 h-4 shrink-0" />
              <span>
                {t('debt.offsetDetail', {
                  offsetAmount: formatCurrency(group.offsetAmount),
                  lent: formatCurrency(group.lentAmount),
                  borrowed: formatCurrency(group.borrowedAmount),
                  net: formatCurrency(group.netAmount),
                })}
              </span>
            </div>
          )}

          {showAllDebts.map((debt) => (
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
