import type { Debt } from '../types/debt'

export const remainingAmount = (debt: Debt) =>
  Math.max(0, debt.amount - (debt.paidAmount ?? 0))

// Work in cents so allocation does not accumulate floating point errors.
const cents = (amount: number) => {
  const value = Math.round(amount * 100)
  if (!Number.isSafeInteger(value) || Math.abs(value - amount * 100) > 0.00001)
    throw new Error('Invalid repayment amount')
  return value
}

export function allocateRepayment(debts: Debt[], amount: number) {
  const requested = cents(amount)
  if (requested <= 0 || !debts.length || debts.length > 450)
    throw new Error('Invalid repayment amount or debt group')
  const first = debts[0]
  if (
    !['lent', 'borrowed'].includes(first.type) ||
    new Set(debts.map((debt) => debt.id)).size !== debts.length ||
    debts.some(
      (debt) => debt.personId !== first.personId || debt.type !== first.type,
    )
  )
    throw new Error('Repayment must belong to one person and debt direction')
  const ordered = [...debts].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  )
  const total = ordered.reduce(
    (sum, debt) => sum + cents(remainingAmount(debt)),
    0,
  )
  if (!Number.isSafeInteger(total) || requested > total)
    throw new Error('Repayment exceeds remaining debt')
  let left = requested
  const allocations: { debtId: string; amount: number; paidAmount: number }[] =
    []
  for (const debt of ordered) {
    const paid = Math.min(left, cents(remainingAmount(debt)))
    if (paid > 0) {
      allocations.push({
        debtId: debt.id,
        amount: paid / 100,
        paidAmount: (cents(debt.paidAmount ?? 0) + paid) / 100,
      })
      left -= paid
    }
    if (!left) break
  }
  return allocations
}
