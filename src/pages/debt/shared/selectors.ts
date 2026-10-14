import { remainingAmount } from '@/utils/repayment'
import type { Debt, DebtSearch } from '@/types/debt'

export function filterDebts(debts: Debt[], search: DebtSearch) {
  return debts.filter(
    (debt) =>
      (!search.personId || debt.personId === search.personId) &&
      (!search.note ||
        (debt.note ?? '').toLowerCase().includes(search.note.toLowerCase())) &&
      (!search.dateFrom || debt.date >= search.dateFrom) &&
      (!search.dateTo || debt.date <= search.dateTo) &&
      (!search.dueDateFrom ||
        (!!debt.dueDate && debt.dueDate >= search.dueDateFrom)) &&
      (!search.dueDateTo ||
        (!!debt.dueDate && debt.dueDate <= search.dueDateTo)),
  )
}

export function summarizePeople(debts: Debt[]) {
  const people = new Map<
    string,
    {
      personId: string
      lent: number
      borrowed: number
      count: number
      net: number
    }
  >()
  for (const debt of debts) {
    const person = people.get(debt.personId) ?? {
      personId: debt.personId,
      lent: 0,
      borrowed: 0,
      count: 0,
      net: 0,
    }
    if (debt.type === 'lent') person.lent += remainingAmount(debt)
    else person.borrowed += remainingAmount(debt)
    person.count++
    person.net = person.lent - person.borrowed
    people.set(debt.personId, person)
  }
  return Array.from(people.values()).sort(
    (a, b) =>
      Math.abs(b.net) - Math.abs(a.net) || a.personId.localeCompare(b.personId),
  )
}
