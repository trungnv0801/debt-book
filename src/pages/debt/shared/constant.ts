export const DEBT_TYPES = {
  LENT: 'lent',
  BORROWED: 'borrowed',
} as const

export const TYPE_LENT = 'lent'

export const TYPE_BORROWED = 'borrowed'

export type DebtType = (typeof DEBT_TYPES)[keyof typeof DEBT_TYPES]
