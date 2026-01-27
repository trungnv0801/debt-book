import { useState } from 'react'
import { usePersons } from '@/hooks/person'
import { Pencil, Trash2 } from 'lucide-react'
import PersonForm from './components/PersonForm'
import { useTranslation } from 'react-i18next'

interface PersonListProps {
  personsHook: ReturnType<typeof usePersons>
}

const PersonList: React.FC<PersonListProps> = ({ personsHook }) => {
  const { t } = useTranslation()
  const { persons, addPerson, editPerson, deletePerson } = personsHook
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-3">
      {persons.map((p) =>
        editing === p.id ? (
          <PersonForm
            key={p.id}
            person={p}
            onSave={(name) => editPerson(p.id, name)}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div
            key={p.id}
            className="flex justify-between items-center bg-slate-800 p-3 rounded-xl"
          >
            <span className="text-white">{p.name}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p.id)}>
                <Pencil className="w-4 h-4 text-blue-400" />
              </button>
              <button onClick={() => deletePerson(p.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ),
      )}

      {adding ? (
        <PersonForm
          onSave={(name) => addPerson(name)}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl flex items-center justify-center"
        >
          {t('add')}
        </button>
      )}
    </div>
  )
}

export default PersonList
