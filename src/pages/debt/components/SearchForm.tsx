import { useTranslation } from 'react-i18next'
import { DebtSearch } from '@/types'
import { usePersons } from '@/hooks/person'
import { SearchSelect } from '@/components/common'

interface SearchFormProps {
  value: DebtSearch
  personsHook: ReturnType<typeof usePersons>
  onChange: (value: DebtSearch) => void
}

const SearchForm: React.FC<SearchFormProps> = ({
  value,
  personsHook,
  onChange,
}) => {
  const { t } = useTranslation()
  const { persons } = personsHook
  const options = persons.map((p) => ({
    id: p.id,
    label: p.name,
  }))

  const handleClear = () => {
    onChange({
      personId: '',
      note: '',
      date: '',
      dueDate: '',
    })
  }

  return (
    <div className="mb-6 bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white mr-4">
          {t('debt.search.title')}
        </h3>

        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg text-sm font-medium transition border border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
        >
          {t('clear')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchSelect
          options={options}
          value={value.personId}
          onChange={(peronId) => onChange({ ...value, personId: peronId })}
          placeholder={t('debt.search.person.input')}
          searchPlaceholder={t('debt.search.person.select')}
        />

        <input
          type="text"
          placeholder={t('debt.search.note')}
          value={value.note}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
          className="p-3 rounded-lg bg-slate-700 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
          className="block w-full p-3 rounded-lg bg-slate-700 text-white"
        />

        <input
          type="date"
          min={value.dueDate}
          value={value.dueDate}
          onChange={(e) => onChange({ ...value, dueDate: e.target.value })}
          className="block w-full p-3 rounded-lg bg-slate-700 text-white"
        />
      </div>
    </div>
  )
}

export default SearchForm
