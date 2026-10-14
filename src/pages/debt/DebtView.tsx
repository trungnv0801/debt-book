import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, ChevronRight, Users, SearchX } from 'lucide-react'
import SearchForm from './components/SearchForm'
import BalanceSummary from './components/BalanceSummary'
import { formatCurrency, INITIAL_DEBT_SEARCH } from './shared'
import { filterDebts, summarizePeople } from './shared/selectors'
import { useDebtWorkspace } from './shared/workspace'
import RepaymentDialog from './components/RepaymentDialog'
import { remainingAmount } from '@/utils/repayment'

export default function DebtView() {
  const { t } = useTranslation()
  const {
    debtHook: { debts, loading, repayDebts },
    personsHook,
    personMap,
    openEditor,
  } = useDebtWorkspace()
  const [params, setParams] = useSearchParams()
  const [repayment, setRepayment] = useState<{
    personId: string
    type: 'lent' | 'borrowed'
  } | null>(null)
  const search = {
    ...INITIAL_DEBT_SEARCH,
    ...Object.fromEntries(
      Object.keys(INITIAL_DEBT_SEARCH).map((key) => [
        key,
        params.get(key) ?? '',
      ]),
    ),
  }
  const direction = params.get('direction') ?? 'all'
  const filtered = filterDebts(debts, search)
  const matchingPeople = new Set(filtered.map((debt) => debt.personId))
  const people = summarizePeople(debts).filter(
    (person) =>
      matchingPeople.has(person.personId) &&
      (direction === 'lent'
        ? person.net > 0
        : direction === 'borrowed'
          ? person.net < 0
          : true),
  )
  const hasFilter = Object.values(search).some(Boolean)
  return (
    <>
      {repayment && (
        <RepaymentDialog
          personName={personMap[repayment.personId] ?? repayment.personId}
          debts={debts.filter(
            (debt) =>
              debt.personId === repayment.personId &&
              debt.type === repayment.type &&
              remainingAmount(debt) > 0,
          )}
          onSave={repayDebts}
          onClose={() => setRepayment(null)}
        />
      )}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
            {t('ui.overview')}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t('debt.title')}
          </h1>
          <p className="mt-2 text-slate-400">{t('debt.subtitle')}</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="ui-primary w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          {t('debt.addTransaction')}
        </button>
      </div>
      <BalanceSummary debts={debts} loading={loading} />
      <SearchForm
        value={search}
        onChange={(value) => {
          const next = new URLSearchParams(params)
          Object.entries(value).forEach(([key, val]) => {
            if (val) next.set(key, val)
            else next.delete(key)
          })
          setParams(next, { replace: true })
        }}
        personsHook={personsHook}
        resultCount={filtered.length}
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
          {t('ui.peopleTitle')}
          {!loading && (
            <span className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-0.5 text-sm font-medium text-slate-300">
              {people.length}
            </span>
          )}
        </h2>
        <div
          className="flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-700/70 bg-slate-900/60 p-1"
          role="group"
          aria-label={t('debt.workspace.balanceFilter')}
        >
          {(['all', 'lent', 'borrowed'] as const).map((value) => (
            <button
              key={value}
              aria-pressed={direction === value}
              onClick={() => {
                const next = new URLSearchParams(params)
                next.set('direction', value)
                setParams(next, { replace: true })
              }}
              className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${direction === value ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {t(`debt.workspace.${value}`)}
            </button>
          ))}
        </div>
      </div>
      {hasFilter && (
        <p className="mb-4 text-sm text-slate-400">
          {t('debt.workspace.filteredPeople')}
        </p>
      )}
      {loading && (
        <div role="status" className="mb-4">
          <span className="sr-only">{t('debt.workspace.loading')}</span>
          <div className="grid gap-4 md:grid-cols-2" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="ui-panel h-36 animate-pulse p-5">
                <div className="mb-3 h-4 w-1/2 rounded bg-slate-700" />
                <div className="h-3 w-1/3 rounded bg-slate-700/70" />
              </div>
            ))}
          </div>
        </div>
      )}
      {!loading && !people.length && (
        <div className="ui-panel flex flex-col items-center px-5 py-12 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-700/50 text-slate-300">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="font-semibold text-white">
            {t('debt.noMatchingPerson')}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            {t(
              hasFilter || direction !== 'all'
                ? 'ui.filterEmptyHint'
                : 'ui.emptyHint',
            )}
          </p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {!loading &&
          people.map((person) => (
            <div
              key={person.personId}
              className="ui-panel min-w-0 overflow-hidden"
            >
              <Link
                to={`/debt/person/${encodeURIComponent(person.personId)}`}
                state={{ returnTo: `/debt?${params.toString()}` }}
                className="group flex min-w-0 items-start gap-3 p-5 transition-colors duration-200 hover:bg-slate-800/80 sm:gap-4 sm:p-6"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-600/70 bg-slate-700/40 font-semibold text-slate-200"
                  aria-hidden="true"
                >
                  {(personMap[person.personId] ?? person.personId)
                    .charAt(0)
                    .toLocaleUpperCase() || <Users className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold text-white">
                    {personMap[person.personId] ?? person.personId}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {t('person.transactions', { count: person.count })}
                  </p>
                  <p
                    className={`mt-4 break-words text-sm font-medium ${person.net > 0 ? 'text-emerald-300' : person.net < 0 ? 'text-rose-300' : 'text-slate-300'}`}
                  >
                    {t(
                      person.net > 0
                        ? 'debt.workspace.receivable'
                        : person.net < 0
                          ? 'debt.workspace.payable'
                          : 'debt.workspace.balanced',
                    )}
                    {person.net !== 0 && (
                      <span className="mt-1 block text-xl font-semibold tracking-tight tabular-nums">
                        {formatCurrency(Math.abs(person.net))}
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight
                  className="mt-3 h-5 w-5 shrink-0 text-slate-500 transition-colors group-hover:text-blue-300"
                  aria-hidden="true"
                />
              </Link>
              {(person.lent > 0 || person.borrowed > 0) && (
                <div className="flex flex-wrap gap-2 border-t border-slate-700/60 px-5 py-3 sm:px-6">
                  {(['lent', 'borrowed'] as const).map(
                    (type) =>
                      person[type] > 0 && (
                        <button
                          key={type}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            setRepayment({ personId: person.personId, type })
                          }
                          className="ui-secondary"
                        >
                          {t(
                            type === 'lent'
                              ? 'debt.repayment.receiveGroup'
                              : 'debt.repayment.payGroup',
                          )}
                        </button>
                      ),
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  )
}
