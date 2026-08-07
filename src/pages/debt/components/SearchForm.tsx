import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Search,
  User,
  X,
} from 'lucide-react'
import { DebtSearch } from '@/types'
import { usePersons } from '@/hooks/person'
import { SearchSelect } from '@/components/common'
import { INITIAL_DEBT_SEARCH, toISODate } from '../shared'

interface SearchFormProps {
  value: DebtSearch
  personsHook: ReturnType<typeof usePersons>
  resultCount?: number
  onChange: (value: DebtSearch) => void
}

interface FilterChip {
  key: keyof DebtSearch
  label: string
}

const inputClass =
  'w-full bg-slate-700 text-white px-4 py-3 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400'

const SearchForm: React.FC<SearchFormProps> = ({
  value,
  personsHook,
  resultCount,
  onChange,
}) => {
  const { t } = useTranslation()
  const { persons } = personsHook
  const [open, setOpen] = useState(false)

  const options = persons.map((p) => ({
    id: p.id,
    label: p.name,
  }))

  const chips = useMemo(() => {
    const personName = persons.find((p) => p.id === value.personId)?.name
    const result: FilterChip[] = []

    if (value.personId && personName) {
      result.push({ key: 'personId', label: personName })
    }
    if (value.note) {
      result.push({ key: 'note', label: `"${value.note}"` })
    }
    if (value.date) {
      result.push({
        key: 'date',
        label: `${t('debt.search.fromDate')}: ${value.date}`,
      })
    }
    if (value.dueDate) {
      result.push({
        key: 'dueDate',
        label: `${t('debt.search.toDate')}: ${value.dueDate}`,
      })
    }

    return result
  }, [persons, value, t])

  const hasFilter = chips.length > 0

  const handleClear = () => onChange(INITIAL_DEBT_SEARCH)

  const handleRemove = (key: keyof DebtSearch) =>
    onChange({ ...value, [key]: '' })

  const handleRange = (from: Date, to: Date) =>
    onChange({ ...value, date: toISODate(from), dueDate: toISODate(to) })

  const handlePresetMonth = () => {
    const now = new Date()
    handleRange(new Date(now.getFullYear(), now.getMonth(), 1), now)
  }

  const handlePresetYear = () => {
    const now = new Date()
    handleRange(new Date(now.getFullYear(), 0, 1), now)
  }

  const handlePresetLast30Days = () => {
    const now = new Date()
    const from = new Date(now)
    from.setDate(from.getDate() - 29)
    handleRange(from, now)
  }

  return (
    <section className="mb-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-5 text-left"
      >
        <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-slate-700 text-blue-400">
          <Search className="w-5 h-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xl font-semibold text-white">
            {t('debt.search.title')}
          </span>
          <span className="block text-sm text-slate-400 truncate">
            {hasFilter
              ? t('debt.search.results', { count: resultCount ?? 0 })
              : t('debt.search.hint')}
          </span>
        </span>

        {hasFilter && (
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
            {chips.length}
          </span>
        )}

        <ChevronDown
          className={`shrink-0 w-5 h-5 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2 px-5 pb-5">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 max-w-full pl-3 pr-1.5 py-1 rounded-full text-sm bg-slate-700 text-slate-200"
            >
              <span className="truncate">{chip.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(chip.key)}
                aria-label={t('clear')}
                className="shrink-0 grid place-items-center w-5 h-5 rounded-full text-slate-400 transition hover:bg-slate-600 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1 rounded-full text-sm font-medium text-slate-400 transition hover:text-white"
          >
            {t('debt.search.clearAll')}
          </button>
        </div>
      )}

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-700 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-slate-400 text-sm mb-2">
                <User className="w-4 h-4" />
                {t('debt.search.person.input')}
              </label>
              <div className="relative">
                <SearchSelect
                  options={options}
                  value={value.personId}
                  onChange={(personId) => onChange({ ...value, personId })}
                  placeholder={t('debt.search.person.input')}
                  searchPlaceholder={t('debt.search.person.select')}
                />
                {value.personId && (
                  <button
                    type="button"
                    onClick={() => handleRemove('personId')}
                    aria-label={t('clear')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-slate-400 transition hover:bg-slate-600 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="debt-search-note"
                className="flex items-center gap-1.5 text-slate-400 text-sm mb-2"
              >
                <FileText className="w-4 h-4" />
                {t('debt.search.note')}
              </label>
              <div className="relative">
                <input
                  id="debt-search-note"
                  type="text"
                  placeholder={t('debt.search.notePlaceholder')}
                  value={value.note}
                  onChange={(e) => onChange({ ...value, note: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                {value.note && (
                  <button
                    type="button"
                    onClick={() => handleRemove('note')}
                    aria-label={t('clear')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-slate-400 transition hover:bg-slate-600 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="debt-search-from"
                className="flex items-center gap-1.5 text-slate-400 text-sm mb-2"
              >
                <CalendarDays className="w-4 h-4" />
                {t('debt.search.fromDate')}
              </label>
              <input
                id="debt-search-from"
                type="date"
                max={value.dueDate || undefined}
                value={value.date}
                onChange={(e) => onChange({ ...value, date: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="debt-search-to"
                className="flex items-center gap-1.5 text-slate-400 text-sm mb-2"
              >
                <CalendarDays className="w-4 h-4" />
                {t('debt.search.toDate')}
              </label>
              <input
                id="debt-search-to"
                type="date"
                min={value.date || undefined}
                value={value.dueDate}
                onChange={(e) =>
                  onChange({ ...value, dueDate: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePresetLast30Days}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 transition hover:bg-slate-600"
            >
              {t('debt.search.preset.last30Days')}
            </button>
            <button
              type="button"
              onClick={handlePresetMonth}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 transition hover:bg-slate-600"
            >
              {t('debt.search.preset.thisMonth')}
            </button>
            <button
              type="button"
              onClick={handlePresetYear}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 transition hover:bg-slate-600"
            >
              {t('debt.search.preset.thisYear')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SearchForm
