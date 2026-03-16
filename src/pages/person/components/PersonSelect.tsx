import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Person } from '@/types/person'
import { SearchSelect } from '@/components/common'

interface PersonSelectProps {
  persons: Person[]
  value: string
  onChange: (id: string) => void
  onAdd: () => void
  placeholder: string
}

const PersonSelect: React.FC<PersonSelectProps> = ({
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

  return (
    <div className="flex gap-2 w-full">
      <SearchSelect
        options={options}
        value={value}
        onChange={onChange}
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
  )
}

export default PersonSelect
