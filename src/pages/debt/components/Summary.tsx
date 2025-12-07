import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react'
import { Debt } from '@/types/debt'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../shared'

interface SummaryProps {
  lentDebts: Debt[]
  borrowedDebts: Debt[]
}

const Summary: React.FC<SummaryProps> = ({ lentDebts, borrowedDebts }) => {
  const { t } = useTranslation()
  const totalLent = lentDebts.reduce((sum, debt) => sum + debt.amount, 0)
  const totalBorrowed = borrowedDebts.reduce(
    (sum, debt) => sum + debt.amount,
    0,
  )
  const netBalance = totalLent - totalBorrowed

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <ArrowUpCircle className="w-8 h-8" />
            <div className="text-right">
              <p className="text-green-100 text-sm">{t('debt.owedToMe')}</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLent)}</p>
            </div>
          </div>
          <div className="text-sm text-green-100">
            {t('debt.people', { count: lentDebts.length })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <ArrowDownCircle className="w-8 h-8" />
            <div className="text-right">
              <p className="text-red-100 text-sm">{t('debt.iOwe')}</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalBorrowed)}
              </p>
            </div>
          </div>
          <div className="text-sm text-red-100">
            {t('debt.people', { count: borrowedDebts.length })}
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl p-6 text-white shadow-xl`}
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <div className="text-right">
              <p className="text-white text-opacity-90 text-sm">
                {t('debt.netBalance')}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(Math.abs(netBalance))}
              </p>
            </div>
          </div>
          <div className="text-sm text-white text-opacity-90">
            {netBalance >= 0 ? t('debt.moreReceived') : t('debt.morePaid')}
          </div>
        </div>
      </div>
    </>
  )
}

export default Summary
