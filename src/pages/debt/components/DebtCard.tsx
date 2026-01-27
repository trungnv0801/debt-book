import { Calendar, Trash2, Edit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Debt } from '@/types'
import { formatCurrency, getDaysUntilDue } from '../shared'

interface DebtCardProps {
  debt: Debt
  color: 'red' | 'green'
  onDelete: (id: string) => void
  onEdit: (debt: Debt) => void
}

export const DebtCard: React.FC<DebtCardProps> = ({
  debt,
  color,
  onDelete,
  onEdit,
}) => {
  const { t, i18n } = useTranslation()
  const daysUntilDue = getDaysUntilDue(debt.dueDate)
  const isOverdue = daysUntilDue < 0

  return (
    <div className="group relative bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xl font-bold ${
                color === 'green' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(debt.amount)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            {t('debt.list.borrowDate')}:{' '}
            {new Date(debt.date).toLocaleDateString(i18n.language)}
          </div>

          {debt.dueDate && (
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              {t('debt.list.dueDate')}:{' '}
              {new Date(debt.dueDate).toLocaleDateString(i18n.language)}
            </div>
          )}

          {isOverdue && (
            <p className="text-red-400 font-semibold mt-2">
              {t('debt.list.overdue', { days: Math.abs(daysUntilDue) })}
            </p>
          )}

          {debt.note && (
            <p className="text-slate-400 text-sm mt-2 italic">"{debt.note}"</p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(debt)}
            className="p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(debt.id)}
            className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebtCard
