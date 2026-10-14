import { remainingAmount } from '@/utils/repayment'
import { useMemo, useRef, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Debt } from '@/types/debt'
import Modal from '@/components/common/Modal'
import { formatCurrency } from '../shared'
import { findDebtMatches, type DebtMatch } from '../shared/matches'

interface Props {
  debts: Debt[]
  personMap: Record<string, string>
  onDelete: (ids: string[]) => Promise<boolean>
}

export default function DebtMatchSuggestions({
  debts,
  personMap,
  onDelete,
}: Props) {
  const { t, i18n } = useTranslation()
  const { matches, limited } = useMemo(() => findDebtMatches(debts), [debts])
  const [selected, setSelected] = useState<DebtMatch | null>(null)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const deleting = useRef(false)

  const details = (match: DebtMatch) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {[match.lent, match.borrowed].map((items, index) => (
        <div key={index} className="rounded-lg bg-slate-900/60 p-3 min-w-0">
          <p
            className={
              index === 0
                ? 'text-green-400 font-semibold'
                : 'text-red-400 font-semibold'
            }
          >
            {t(index === 0 ? 'debt.lend' : 'debt.borrow')} ·{' '}
            {formatCurrency(match.amount)}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {items.map((debt) => (
              <li key={debt.id} className="border-t border-slate-700 pt-2">
                <span className="font-semibold">
                  {formatCurrency(remainingAmount(debt))}
                </span>
                <span className="text-slate-400">
                  {' '}
                  · {new Date(debt.date).toLocaleDateString(i18n.language)}
                </span>
                {debt.note && (
                  <p className="break-words text-slate-400">{debt.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )

  const confirmDelete = async () => {
    if (!selected || deleting.current) return
    deleting.current = true
    setPending(true)
    setFailed(false)
    try {
      const ids = [...selected.lent, ...selected.borrowed].map(
        (debt) => debt.id,
      )
      const current = new Map(debts.map((debt) => [debt.id, debt]))
      if (
        [...selected.lent, ...selected.borrowed].some(
          (debt) => current.get(debt.id) !== debt,
        )
      ) {
        setFailed(true)
        return
      }
      if (await onDelete(ids)) setSelected(null)
      else setFailed(true)
    } catch {
      setFailed(true)
    } finally {
      deleting.current = false
      setPending(false)
    }
  }

  return (
    <section className="mb-6 rounded-xl border border-amber-500/30 bg-slate-800 p-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
        <ArrowLeftRight className="w-5 h-5" />
        {t('debt.matches.title', { count: matches.length })}
      </h2>
      <p className="mt-1 text-sm text-slate-400">{t('debt.matches.hint')}</p>
      {limited && (
        <p className="mt-2 text-sm text-amber-300">
          {t('debt.matches.limited')}
        </p>
      )}
      {!matches.length && (
        <p className="mt-3 text-slate-300">{t('debt.matches.empty')}</p>
      )}
      <div className="space-y-3 max-h-[36rem] overflow-y-auto mt-3">
        {matches.map((match) => (
          <details
            key={[...match.lent, ...match.borrowed]
              .map((debt) => debt.id)
              .join(',')}
            className="rounded-lg border border-slate-700 p-3"
          >
            <summary className="cursor-pointer text-white">
              {personMap[match.personId] ?? match.personId} ·{' '}
              {formatCurrency(match.amount)} ·{' '}
              {t('person.transactions', {
                count: match.lent.length + match.borrowed.length,
              })}
            </summary>
            {details(match)}
            <button
              type="button"
              onClick={() => {
                setSelected(match)
                setFailed(false)
              }}
              className="mt-3 rounded-lg bg-red-500/15 px-4 py-2 text-red-300 hover:bg-red-500/25"
            >
              {t('debt.matches.review')}
            </button>
          </details>
        ))}
      </div>
      <Modal
        open={!!selected}
        onClose={() => {
          if (!deleting.current) setSelected(null)
        }}
        title={t('debt.matches.confirmTitle')}
        widthClass="max-w-2xl"
      >
        {selected && (
          <>
            <div className="max-h-[60vh] overflow-y-auto">
              <p className="text-white font-semibold">
                {personMap[selected.personId] ?? selected.personId}
              </p>
              <p className="mt-2 text-slate-300">
                {t('debt.matches.confirm', {
                  count: selected.lent.length + selected.borrowed.length,
                  amount: formatCurrency(selected.amount),
                })}
              </p>
              {details(selected)}
            </div>
            {failed && (
              <p role="alert" className="mt-3 text-red-400">
                {t('debt.matches.failed')}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                disabled={pending}
                onClick={() => setSelected(null)}
                className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                disabled={pending}
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {t(
                  pending
                    ? 'debt.matches.deleting'
                    : 'debt.matches.deleteGroup',
                )}
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
