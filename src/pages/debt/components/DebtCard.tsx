import { useState } from 'react'
import { Banknote, Calendar, Trash2, Edit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Debt } from '@/types'
import Modal from '@/components/common/Modal'
import { formatCurrency, getDaysUntilDue } from '../shared'
import { remainingAmount } from '@/utils/repayment'

interface DebtCardProps {
  debt: Debt
  color: 'red' | 'green'
  onDelete: (id: string) => void
  onEdit: (debt: Debt) => void
  onRepay?: (debt: Debt) => void
}

export const DebtCard: React.FC<DebtCardProps> = ({
  debt,
  color,
  onDelete,
  onEdit,
  onRepay,
}) => {
  const { t, i18n } = useTranslation()
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const daysUntilDue = getDaysUntilDue(debt.dueDate)
  const remaining = remainingAmount(debt)
  const isOverdue = daysUntilDue < 0 && remaining > 0

  const handleConfirmDelete = () => {
    onDelete(debt.id)
    setIsDeleteConfirmOpen(false)
  }

  return (
    <div className="ui-panel group relative p-4 transition-colors duration-200 hover:border-slate-500 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`break-words text-xl font-semibold tabular-nums ${
                color === 'green' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(remaining)}
            </span>
          </div>

          {!!debt.paidAmount && (
            <p className="text-sm text-slate-400">
              {t('debt.repayment.original')}: {formatCurrency(debt.amount)} ·{' '}
              {t('debt.repayment.paid')}: {formatCurrency(debt.paidAmount)}
            </p>
          )}
          {remaining === 0 && (
            <p className="text-sm text-emerald-300">
              {t('debt.repayment.settled')}
            </p>
          )}
          {!!debt.payments?.length && (
            <details className="text-sm text-slate-400">
              <summary className="cursor-pointer">
                {t('debt.repayment.history')}
              </summary>
              {debt.payments.map((payment, index) => (
                <p key={index} className="mt-1">
                  {new Date(payment.paidAt).toLocaleString(i18n.language)} ·{' '}
                  {formatCurrency(payment.amount)}
                </p>
              ))}
            </details>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
            {t('debt.list.borrowDate')}:{' '}
            {new Date(debt.date).toLocaleDateString(i18n.language)}
          </div>

          {debt.dueDate && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
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
            <p className="break-words text-slate-300 text-sm mt-2">
              {debt.note}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row items-end">
          {onRepay && remaining > 0 && (
            <button
              type="button"
              onClick={() => onRepay(debt)}
              aria-label={t('debt.repayment.title')}
              title={t('debt.repayment.title')}
              className="ui-icon-button bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            >
              <Banknote className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <button
            onClick={() => onEdit(debt)}
            aria-label={t('debt.updateTransaction')}
            className="ui-icon-button bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            aria-label={t('delete')}
            className="ui-icon-button bg-red-500/10 text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Modal
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title={t('delete')}
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            {t('debt.list.deleteConfirmMessage')}
          </p>
          <p className="text-slate-400 text-sm">
            {t('debt.list.amount')}:{' '}
            <span
              className={`font-semibold ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}
            >
              {formatCurrency(debt.amount)}
            </span>
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DebtCard
