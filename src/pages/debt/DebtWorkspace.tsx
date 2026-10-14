import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDebts } from '@/hooks/debt'
import { usePersons } from '@/hooks/person'
import type { Debt } from '@/types/debt'
import DebtEditor from './components/DebtEditor'
import type { DebtWorkspaceContext } from './shared/workspace'

export default function DebtWorkspace() {
  const debtHook = useDebts()
  const personsHook = usePersons()
  const { getDebts, error } = debtHook
  const { getPersons, persons } = personsHook
  const [editor, setEditor] = useState<{
    debt?: Debt
    personId?: string
  } | null>(null)
  const [personError, setPersonError] = useState('')
  useEffect(() => {
    void getDebts()
  }, [getDebts])
  useEffect(() => {
    void getPersons().catch((error: unknown) => setPersonError(String(error)))
  }, [getPersons])
  const context: DebtWorkspaceContext = {
    debtHook,
    personsHook,
    personMap: Object.fromEntries(
      persons.map((person) => [person.id, person.name]),
    ),
    openEditor: (debt, personId) => setEditor({ debt, personId }),
  }
  return (
    <div className="mx-auto max-w-7xl py-8 sm:py-10">
      {(error || personError) && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-300"
        >
          {error || personError}
        </p>
      )}
      <Outlet context={context} />
      {editor && (
        <DebtEditor
          {...editor}
          debtHook={debtHook}
          personsHook={personsHook}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  )
}
