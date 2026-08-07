export interface Debt {
  id: string
  type: string
  personId: string
  amount: number
  date: string
  dueDate: string
  note: string
}

export interface PersonDebtGroup {
  personId: string
  personName: string
  totalAmount: number
  debts: Debt[]
  netAmount: number
  offsetAmount: number
  isOffset: boolean
  lentAmount: number
  borrowedAmount: number
}

export interface DebtSearch {
  personId: string
  dateFrom: string
  dateTo: string
  dueDateFrom: string
  dueDateTo: string
  note: string
}
