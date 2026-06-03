import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import { Person } from '@/types/person'
import { SearchSelect } from '@/components/common'

interface MultiPersonSelectProps {
  persons: Person[]
  value: string[]
  onChange: (ids: string[]) => void
  onAdd: () => void
  placeholder: string
}

const MultiPersonSelect: React.FC<MultiPersonSelectProps> = ({
  persons,
  value,
  onChange,
  onAdd,
  placeholder,
}) => {
  const { t } = useTranslation()
  const options = persons.map((p) => ({
    id: p.id,
    label: p.name,
  }))

  const handleAdd = (personId: string) => {
    if (!value.includes(personId)) {
      onChange([...value, personId])
    }
  }

  const handleRemove = (personId: string) => {
    onChange(value.filter((id) => id !== personId))
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <SearchSelect
          options={options}
          value=""
          onChange={handleAdd}
          placeholder={placeholder}
          searchPlaceholder={t('debt.search.person.select')}
        />
        <button
          type="button"
          onClick={onAdd}
          className="w-12 shrink-0 bg-slate-700 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((personId) => (
            <div
              key={personId}
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg"
            >
              <span className="text-sm">
                {persons.find((p) => p.id === personId)?.name || personId}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(personId)}
                className="hover:bg-blue-600 rounded flex items-center justify-center p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiPersonSelect
