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

export function groupDebtsByPersonWithOffset(
  allDebts: Debt[],
  personMap: Record<string, string>,
): {
  lentGroups: PersonDebtGroup[]
  borrowedGroups: PersonDebtGroup[]
} {
  const personData: Record<
    string,
    {
      lentDebts: Debt[]
      borrowedDebts: Debt[]
      lentAmount: number
      borrowedAmount: number
    }
  > = {}

  for (const debt of allDebts) {
    if (!personData[debt.personId]) {
      personData[debt.personId] = {
        lentDebts: [],
        borrowedDebts: [],
        lentAmount: 0,
        borrowedAmount: 0,
      }
    }
    if (debt.type === TYPE_LENT) {
      personData[debt.personId].lentDebts.push(debt)
      personData[debt.personId].lentAmount += debt.amount
    } else {
      personData[debt.personId].borrowedDebts.push(debt)
      personData[debt.personId].borrowedAmount += debt.amount
    }
  }

  const lentGroups: PersonDebtGroup[] = []
  const borrowedGroups: PersonDebtGroup[] = []

  for (const [personId, data] of Object.entries(personData)) {
    const { lentAmount, borrowedAmount, lentDebts, borrowedDebts } = data
    const offsetAmount = Math.min(lentAmount, borrowedAmount)
    const isOffset = offsetAmount > 0
    const personName = personMap[personId] ?? personId

    if (lentDebts.length > 0) {
      lentGroups.push({
        personId,
        personName,
        totalAmount: lentAmount,
        debts: lentDebts,
        netAmount: Math.max(0, lentAmount - borrowedAmount),
        offsetAmount,
        isOffset,
        lentAmount,
        borrowedAmount,
      })
    }

    if (borrowedDebts.length > 0) {
      borrowedGroups.push({
        personId,
        personName,
        totalAmount: borrowedAmount,
        debts: borrowedDebts,
        netAmount: Math.max(0, borrowedAmount - lentAmount),
        offsetAmount,
        isOffset,
        lentAmount,
        borrowedAmount,
      })
    }
  }

  lentGroups.sort((a, b) => b.totalAmount - a.totalAmount)
  borrowedGroups.sort((a, b) => b.totalAmount - a.totalAmount)

  return { lentGroups, borrowedGroups }
}

export const formatAmount = (value?: number) =>
  value && value > 0
    ? value.toString().replace(THOUSAND_SEPARATOR_REGEX, '.')
    : ''
