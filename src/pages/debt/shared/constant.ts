import { DebtSearch } from '@/types'

export const DEBT_TYPES = {
  LENT: 'lent',
  BORROWED: 'borrowed',
} as const

export const TYPE_LENT = 'lent'

export const TYPE_BORROWED = 'borrowed'

export type DebtType = (typeof DEBT_TYPES)[keyof typeof DEBT_TYPES]

export const INITIAL_DEBT_SEARCH: DebtSearch = {
  personId: '',
  dateFrom: '',
  dateTo: '',
  dueDateFrom: '',
  dueDateTo: '',
  note: '',
}
