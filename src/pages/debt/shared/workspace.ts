import { useOutletContext } from 'react-router-dom'
import type { useDebts } from '@/hooks/debt'
import type { usePersons } from '@/hooks/person'
import type { Debt } from '@/types/debt'

export interface DebtWorkspaceContext {
  debtHook: ReturnType<typeof useDebts>
  personsHook: ReturnType<typeof usePersons>
  personMap: Record<string, string>
  openEditor: (debt?: Debt, personId?: string) => void
}

export const useDebtWorkspace = () => useOutletContext<DebtWorkspaceContext>()
