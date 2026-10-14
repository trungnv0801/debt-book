import { useTranslation } from 'react-i18next'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import type { Debt } from '@/types/debt'
import { summarizePeople } from '../shared/selectors'
import { formatCurrency } from '../shared'

interface Props {
  debts: Debt[]
  loading?: boolean
  personal?: boolean
}

export default function BalanceSummary({
  debts,
  loading = false,
  personal = false,
}: Props) {
  const { t } = useTranslation()
  const people = summarizePeople(debts)
  const receivable = people.reduce(
    (sum, person) => sum + Math.max(0, person.net),
    0,
  )
  const payable = people.reduce(
    (sum, person) => sum + Math.max(0, -person.net),
    0,
  )
  const cards = [
    {
      label: 'debt.workspace.receivable',
      value: receivable,
      icon: ArrowDownLeft,
      color: 'text-emerald-300',
      badge: 'bg-emerald-400/10',
      panel: 'ui-panel',
    },
    {
      label: 'debt.workspace.payable',
      value: payable,
      icon: ArrowUpRight,
      color: 'text-rose-300',
      badge: 'bg-rose-400/10',
      panel: 'ui-panel',
    },
    {
      label: 'debt.netBalance',
      value: receivable - payable,
      icon: Wallet,
      color: 'text-blue-200',
      badge: 'bg-blue-400/15',
      panel: 'rounded-2xl border border-blue-400/30 bg-blue-500/10',
    },
  ]
  return (
    <section className="mb-8" aria-busy={loading}>
      <h2 className="mb-3 text-sm font-medium text-slate-400">
        {t(personal ? 'ui.personBalance' : 'debt.workspace.wholeBalance')}
      </h2>
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.panel} min-w-0 p-5 sm:p-6`}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-300">
                {t(card.label)}
              </p>
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${card.badge} ${card.color}`}
              >
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p
              className={`break-words text-2xl font-semibold tracking-tight tabular-nums lg:text-3xl ${card.color}`}
            >
              {loading ? '—' : formatCurrency(card.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
