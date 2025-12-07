import {
  Trash2,
  User,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'
import type React from 'react'
import { Debt } from '@/types/debt'
import { useTranslation } from 'react-i18next'
import { formatCurrency, getDaysUntilDue } from '../shared'

interface DebtListProps {
  lentDebts: Debt[]
  borrowedDebts: Debt[]
  handleDeleteDebt: (id: string) => void
}

const DebtList: React.FC<DebtListProps> = ({
  lentDebts,
  borrowedDebts,
  handleDeleteDebt,
}) => {
  const { t, i18n } = useTranslation()

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowUpCircle className="w-6 h-6 text-green-400" />
            {t('debt.owedToMe')}
          </h2>
          <div className="space-y-3">
            {lentDebts.map((debt) => {
              const daysUntilDue = getDaysUntilDue(debt.dueDate)
              const isOverdue = daysUntilDue < 0

              return (
                <div
                  key={debt.id}
                  className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 hover:border-green-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {debt.personName}
                        </h3>
                        <p className="text-green-400 font-semibold">
                          {formatCurrency(debt.amount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDebt(debt.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {t('debt.list.borrowDate')}:{' '}
                      {new Date(debt.date).toLocaleDateString(i18n.language)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {debt.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t('debt.list.dueDate')}:{' '}
                        {new Date(debt.dueDate).toLocaleDateString(
                          i18n.language,
                        )}
                      </div>
                    )}
                    {isOverdue && (
                      <span className="text-red-400 font-semibold">
                        {t('debt.list.overdue', {
                          days: Math.abs(daysUntilDue),
                        })}
                      </span>
                    )}
                  </div>
                  {debt.note && (
                    <p className="text-slate-400 text-sm mt-2 italic">
                      "{debt.note}"
                    </p>
                  )}
                </div>
              )
            })}
            {lentDebts.length === 0 && (
              <div className="text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-400">
                  {t('debt.list.noLendTransactions')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Borrowed Money Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowDownCircle className="w-6 h-6 text-red-400" />
            {t('debt.iOwe')}
          </h2>
          <div className="space-y-3">
            {borrowedDebts.map((debt) => {
              const daysUntilDue = getDaysUntilDue(debt.dueDate)
              const isOverdue = daysUntilDue < 0

              return (
                <div
                  key={debt.id}
                  className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 hover:border-red-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {debt.personName}
                        </h3>
                        <p className="text-red-400 font-semibold">
                          {formatCurrency(debt.amount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDebt(debt.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {t('debt.list.borrowDate')}:{' '}
                      {new Date(debt.date).toLocaleDateString(i18n.language)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {debt.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t('debt.list.dueDate')}:{' '}
                        {new Date(debt.dueDate).toLocaleDateString(
                          i18n.language,
                        )}
                      </div>
                    )}
                    {isOverdue && (
                      <span className="text-red-400 font-semibold">
                        {t('debt.list.overdue', {
                          days: Math.abs(daysUntilDue),
                        })}
                      </span>
                    )}
                  </div>
                  {debt.note && (
                    <p className="text-slate-400 text-sm mt-2 italic">
                      "{debt.note}"
                    </p>
                  )}
                </div>
              )
            })}
            {borrowedDebts.length === 0 && (
              <div className="text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-400">
                  {t('debt.list.noBorrowTransactions')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DebtList
