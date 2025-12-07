import { Debt } from '@/types/debt'
import { TYPE_LENT } from './constant'

export const INITIAL_DEBT: Debt = {
  id: '',
  type: TYPE_LENT,
  personName: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  note: '',
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export const getDaysUntilDue = (dueDate: string) => {
  const today = new Date().getTime()
  const due = new Date(dueDate).getTime()
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return diff
}

export const summarizeByPerson = (debts: Debt[]) => {
  const summary: Record<string, number> = {}

  debts.forEach((d) => {
    if (!summary[d.personName]) summary[d.personName] = 0
    summary[d.personName] += d.amount
  })

  return summary
}
