import { Debt, PersonDebtGroup } from '@/types/debt'
import { TYPE_LENT } from './constant'
import { THOUSAND_SEPARATOR_REGEX } from '@/utils'

export const INITIAL_DEBT: Debt = {
  id: '',
  type: TYPE_LENT,
  personId: '',
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
    if (!summary[d.id]) summary[d.id] = 0
    summary[d.id] += d.amount
  })

  return summary
}

export const groupDebtsByPerson = (
  debts: Debt[],
  personMap: Record<string, string>,
): PersonDebtGroup[] => {
  const map: Record<string, PersonDebtGroup> = {}

  debts.forEach((d) => {
    if (!map[d.personId]) {
      map[d.personId] = {
        personId: d.personId,
        personName: personMap[d.personId],
        totalAmount: 0,
        debts: [],
      }
    }

    map[d.personId].totalAmount += d.amount
    map[d.personId].debts.push(d)
  })

  return Object.values(map)
}

export const formatAmount = (value?: number) =>
  value && value > 0
    ? value.toString().replace(THOUSAND_SEPARATOR_REGEX, '.')
    : ''
