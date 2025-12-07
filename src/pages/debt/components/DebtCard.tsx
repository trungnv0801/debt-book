import { Calendar, Trash2, User, Edit } from 'lucide-react'
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

  const colorClass = color === 'green' ? 'green-500' : 'red-500'
  const hoverBorder =
    color === 'green' ? 'hover:border-green-500' : 'hover:border-red-500'
  const amountColor = color === 'green' ? 'text-green-400' : 'text-red-400'

  return (
    <div
      className={`bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 transition-all ${hoverBorder}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`bg-${colorClass} w-10 h-10 rounded-lg flex items-center justify-center`}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{debt.personName}</h3>
            <p className={`${amountColor} font-semibold`}>
              {formatCurrency(debt.amount)}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(debt)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(debt.id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
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
  )
}
