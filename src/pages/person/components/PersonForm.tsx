import { useState } from 'react'
import { Person } from '@/types/person'
import { useTranslation } from 'react-i18next'

interface Props {
  person?: Person
  onSave: (name: string) => Promise<string | void>
  onCancel: () => void
}

const PersonForm: React.FC<Props> = ({ person, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [name, setName] = useState(person?.name ?? '')

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <input
        autoFocus
        type="text"
        placeholder={t('person.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setName(name.trim())}
        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg mb-3"
      />

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 rounded-lg text-white"
        >
          {t('cancel')}
        </button>
        <button
          onClick={async () => {
            if (!name.trim()) return
            await onSave(name)
            onCancel()
          }}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white"
        >
          {t('save')}
        </button>
      </div>
    </div>
  )
}

export default PersonForm
