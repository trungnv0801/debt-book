import { remainingAmount } from '@/utils/repayment'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebtWorkspace } from './shared/workspace'
import { filterDebts } from './shared/selectors'
import { formatCurrency, INITIAL_DEBT_SEARCH } from './shared'
import BalanceSummary from './components/BalanceSummary'
import SearchForm from './components/SearchForm'
import DebtCard from './components/DebtCard'
import DebtMatchSuggestions from './components/DebtMatchSuggestions'
import RepaymentDialog from './components/RepaymentDialog'

export default function PersonDebtView() {
  const { personId } = useParams()
  const { state } = useLocation()
  const { t } = useTranslation()
  const { debtHook, personsHook, personMap, openEditor } = useDebtWorkspace()
  const [search, setSearch] = useState(INITIAL_DEBT_SEARCH)
  const [showMatches, setShowMatches] = useState(false)
  const [repayment, setRepayment] = useState<{
    debtId?: string
    type?: string
  } | null>(null)
  const debts = debtHook.debts.filter((debt) => debt.personId === personId)
  const filtered = filterDebts(debts, search).sort(
    (a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id),
  )
  const hasFilter = Object.values(search).some(Boolean)
  const returnTo =
    typeof state?.returnTo === 'string' && state.returnTo.startsWith('/debt?')
      ? state.returnTo
      : '/debt'
  return (
    <>
      <Link to={returnTo} className="mb-4 inline-block text-blue-300">
        ← {t('debt.workspace.back')}
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="break-words text-3xl font-bold text-white">
          {personMap[personId ?? ''] ?? personId}
        </h1>
        <button
          onClick={() => openEditor(undefined, personId)}
          className="ui-primary w-full sm:w-auto"
        >
          {t('debt.addTransaction')}
        </button>
      </div>
      <BalanceSummary debts={debts} loading={debtHook.loading} personal />
      <section className="ui-panel mb-4 p-5">
        <h2 className="mb-2 text-lg font-semibold text-white">
          {t('debt.repayment.groupTitle')}
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          {t('debt.repayment.oldestFirst')}
        </p>
        <div className="flex flex-wrap gap-3">
          {(['lent', 'borrowed'] as const).map((type) => (
            <button
              key={type}
              disabled={
                debtHook.loading ||
                !debts.some(
                  (debt) => debt.type === type && remainingAmount(debt) > 0,
                )
              }
              onClick={() => setRepayment({ type })}
              className="ui-secondary disabled:opacity-50"
            >
              {t(
                type === 'lent'
                  ? 'debt.repayment.receiveGroup'
                  : 'debt.repayment.payGroup',
              )}
            </button>
          ))}
        </div>
      </section>
      {repayment && (
        <RepaymentDialog
          personName={personMap[personId ?? ''] ?? personId}
          debts={debts.filter((debt) =>
            repayment.debtId
              ? debt.id === repayment.debtId
              : debt.type === repayment.type && remainingAmount(debt) > 0,
          )}
          onSave={debtHook.repayDebts}
          onClose={() => setRepayment(null)}
        />
      )}
      <p className="mb-6 text-sm text-slate-400">
        {t('debt.workspace.grossTotals', {
          lent: formatCurrency(
            debts
              .filter((debt) => debt.type === 'lent')
              .reduce((sum, debt) => sum + remainingAmount(debt), 0),
          ),
          borrowed: formatCurrency(
            debts
              .filter((debt) => debt.type === 'borrowed')
              .reduce((sum, debt) => sum + remainingAmount(debt), 0),
          ),
        })}
      </p>
      <SearchForm
        value={search}
        onChange={setSearch}
        personsHook={personsHook}
        resultCount={filtered.length}
        hidePerson
      />
      <h2 className="mb-3 text-xl font-semibold text-white">
        {t('debt.workspace.transactions')}
      </h2>
      {hasFilter && (
        <p className="mb-4 text-sm text-slate-400">
          {t('debt.workspace.filteredTransactions', { count: filtered.length })}
        </p>
      )}
      {debtHook.loading && (
        <p role="status" className="mb-4 text-slate-400">
          {t('debt.workspace.loading')}
        </p>
      )}
      {!debtHook.loading && !filtered.length && (
        <p className="mb-6 text-slate-400">
          {t('debt.workspace.emptyTransactions')}
        </p>
      )}
      <div className="mb-6 space-y-3">
        {filtered.map((debt) => (
          <div key={debt.id}>
            <p
              className={`mb-1 text-sm ${debt.type === 'lent' ? 'text-green-400' : 'text-red-400'}`}
            >
              {t(debt.type === 'lent' ? 'debt.lend' : 'debt.borrow')}
            </p>
            <DebtCard
              debt={debt}
              color={debt.type === 'lent' ? 'green' : 'red'}
              onEdit={() => openEditor(debt)}
              onRepay={(debt) => setRepayment({ debtId: debt.id })}
              onDelete={(id) => {
                void debtHook.deleteDebt(id)
              }}
            />
          </div>
        ))}
      </div>
      <details
        onToggle={(event) => setShowMatches(event.currentTarget.open)}
        className="rounded-xl border border-slate-700 p-4"
      >
        <summary className="cursor-pointer font-semibold text-amber-300">
          {t('debt.workspace.reconcile')}
        </summary>
        <div className="mt-4">
          {showMatches && (
            <DebtMatchSuggestions
              debts={filtered}
              personMap={personMap}
              onDelete={debtHook.deleteMultipleDebts}
            />
          )}
        </div>
      </details>
    </>
  )
}
