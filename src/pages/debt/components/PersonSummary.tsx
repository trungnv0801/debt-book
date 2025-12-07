import { Debt } from '@/types'
import { useTranslation } from 'react-i18next'
import { formatCurrency, summarizeByPerson } from '../shared'
import { useState } from 'react'

interface PersonSummaryProps {
  lentDebts: Debt[]
  borrowedDebts: Debt[]
}

export const PersonSummary: React.FC<PersonSummaryProps> = ({
  lentDebts,
  borrowedDebts,
}) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const lentSummary = summarizeByPerson(lentDebts)
  const borrowedSummary = summarizeByPerson(borrowedDebts)

  let people = new Set([
    ...Object.keys(lentSummary),
    ...Object.keys(borrowedSummary),
  ])

  if (search.trim() !== '') {
    people = new Set(
      Array.from(people).filter((name) =>
        name.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }

  return (
    <div className="mb-4 bg-slate-800 p-6 rounded-xl border border-slate-700 mt-10">
      <h2 className="text-2xl font-bold text-white mb-5">
        {t('debt.summaryByPerson')}
      </h2>

      <input
        type="text"
        placeholder={t('debt.searchPerson')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-5 p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {people.size === 0 ? (
        <p className="text-slate-400 text-center py-6">
          {t('debt.noMatchingPerson')}
        </p>
      ) : (
        <div className="space-y-4">
          {Array.from(people).map((name) => {
            const lend = lentSummary[name] || 0
            const borrow = borrowedSummary[name] || 0
            const net = lend - borrow

            return (
              <div
                key={name}
                className="flex items-center justify-between bg-slate-700 p-4 rounded-lg shadow"
              >
                <div className="text-white font-semibold">{name}</div>

                <div className="text-right">
                  {lend > 0 && (
                    <p className="text-green-400">
                      {t('debt.lend')}: {formatCurrency(lend)}
                    </p>
                  )}

                  {borrow > 0 && (
                    <p className="text-red-400">
                      {t('debt.borrow')}: {formatCurrency(borrow)}
                    </p>
                  )}

                  <p
                    className={`font-bold ${
                      net >= 0 ? 'text-blue-400' : 'text-orange-400'
                    }`}
                  >
                    {t('debt.netBalance')}: {formatCurrency(Math.abs(net))}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
