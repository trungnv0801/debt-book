import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarClock,
  CalendarDays,
  ChevronDown,
  FileText,
  LucideIcon,
  Search,
  User,
  X,
} from 'lucide-react'
import { DebtSearch } from '@/types'
import { usePersons } from '@/hooks/person'
import { DateRangePicker, SearchSelect } from '@/components/common'
import { INITIAL_DEBT_SEARCH } from '../shared'

interface SearchFormProps {
  value: DebtSearch
  personsHook: ReturnType<typeof usePersons>
  resultCount?: number
  onChange: (value: DebtSearch) => void
}

interface FilterChip {
  id: string
  icon: LucideIcon
  label: string
  colorClass: string
  onRemove: () => void
}

const CHIP_COLORS = {
  person: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  note: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  date: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  dueDate: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
} as const

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

  const handleClear = () => onChange(INITIAL_DEBT_SEARCH)

  const handleRemove = (key: keyof DebtSearch) =>
    onChange({ ...value, [key]: '' })

  const formatRange = (from: string, to: string) => {
    if (from && to) return `${from} → ${to}`
    if (from) return `${t('debt.search.fromDate')} ${from}`
    return `${t('debt.search.toDate')} ${to}`
  }

  const chips = (() => {
    const personName = persons.find((p) => p.id === value.personId)?.name
    const result: FilterChip[] = []

    if (value.personId && personName) {
      result.push({
        id: 'personId',
        icon: User,
        label: personName,
        colorClass: CHIP_COLORS.person,
        onRemove: () => handleRemove('personId'),
      })
    }
    if (value.note) {
      result.push({
        id: 'note',
        icon: FileText,
        label: `"${value.note}"`,
        colorClass: CHIP_COLORS.note,
        onRemove: () => handleRemove('note'),
      })
    }
    if (value.dateFrom || value.dateTo) {
      result.push({
        id: 'date',
        icon: CalendarDays,
        label: `${t('debt.search.date')}: ${formatRange(value.dateFrom, value.dateTo)}`,
        colorClass: CHIP_COLORS.date,
        onRemove: () => onChange({ ...value, dateFrom: '', dateTo: '' }),
      })
    }
    if (value.dueDateFrom || value.dueDateTo) {
      result.push({
        id: 'dueDate',
        icon: CalendarClock,
        label: `${t('debt.search.dueDate')}: ${formatRange(value.dueDateFrom, value.dueDateTo)}`,
        colorClass: CHIP_COLORS.dueDate,
        onRemove: () => onChange({ ...value, dueDateFrom: '', dueDateTo: '' }),
      })
    }

    return result
  })()

  const hasFilter = chips.length > 0

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
              key={chip.id}
              className={`inline-flex items-center gap-1.5 max-w-full pl-1.5 pr-1.5 py-1 rounded-full text-sm border ${chip.colorClass}`}
            >
              <chip.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate font-medium">{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={t('clear')}
                className="shrink-0 grid place-items-center w-5 h-5 rounded-full transition hover:bg-white/10"
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
                htmlFor="debt-search-date"
                className="flex items-center gap-1.5 text-slate-400 text-sm mb-2"
              >
                <CalendarDays className="w-4 h-4" />
                {t('debt.search.date')}
              </label>
              <DateRangePicker
                id="debt-search-date"
                startDate={value.dateFrom}
                endDate={value.dateTo}
                onChange={(start, end) =>
                  onChange({ ...value, dateFrom: start, dateTo: end })
                }
              />
            </div>

            <div>
              <label
                htmlFor="debt-search-due-date"
                className="flex items-center gap-1.5 text-slate-400 text-sm mb-2"
              >
                <CalendarDays className="w-4 h-4" />
                {t('debt.search.dueDate')}
              </label>
              <DateRangePicker
                id="debt-search-due-date"
                startDate={value.dueDateFrom}
                endDate={value.dueDateTo}
                onChange={(start, end) =>
                  onChange({ ...value, dueDateFrom: start, dueDateTo: end })
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default SearchForm
