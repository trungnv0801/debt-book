import { remainingAmount } from '@/utils/repayment'
import type { Debt } from '@/types/debt'

export interface DebtMatch {
  personId: string
  lent: Debt[]
  borrowed: Debt[]
  amount: number
}

const cents = (amount: number) => Math.round(amount * 100)
const MAX_STATES = 10000
const MAX_STEPS = 200000
export const MAX_MATCH_DEBTS = 450

// Keep one representative per sum. Bound the search to keep large books responsive.
function subsetSums(debts: Debt[], ceiling: number) {
  const sums = new Map<number, Debt[]>([[0, []]])
  let steps = 0
  let limited = false
  for (const debt of debts) {
    for (const [sum, subset] of Array.from(sums)) {
      if (++steps > MAX_STEPS) return { sums, limited: true }
      const next = sum + cents(remainingAmount(debt))
      if (next > ceiling || sums.has(next)) continue
      if (sums.size >= MAX_STATES || subset.length >= MAX_MATCH_DEBTS / 2) {
        limited = true
        continue
      }
      sums.set(next, [...subset, debt])
    }
  }
  return { sums, limited }
}

export function findDebtMatches(debts: Debt[]) {
  const people = new Map<string, { lent: Debt[]; borrowed: Debt[] }>()
  for (const debt of debts) {
    if (
      !debt.personId ||
      !Number.isFinite(remainingAmount(debt)) ||
      remainingAmount(debt) <= 0 ||
      !Number.isSafeInteger(cents(remainingAmount(debt))) ||
      Math.abs(remainingAmount(debt) * 100 - cents(remainingAmount(debt))) >
        0.00001 ||
      (debt.type !== 'lent' && debt.type !== 'borrowed')
    )
      continue
    const group = people.get(debt.personId) ?? { lent: [], borrowed: [] }
    group[debt.type].push(debt)
    people.set(debt.personId, group)
  }

  const matches: DebtMatch[] = []
  let limited = false
  for (const [personId, group] of Array.from(people)) {
    const lent = [...group.lent].sort((a, b) => a.id.localeCompare(b.id))
    const borrowed = [...group.borrowed].sort((a, b) =>
      a.id.localeCompare(b.id),
    )
    // Resolve exact pairs first, without exponential subset searches.
    for (let i = lent.length - 1; i >= 0; i--) {
      const j = borrowed.findIndex(
        (debt) =>
          cents(remainingAmount(debt)) === cents(remainingAmount(lent[i])),
      )
      if (j < 0) continue
      matches.push({
        personId,
        lent: [lent[i]],
        borrowed: [borrowed[j]],
        amount: remainingAmount(lent[i]),
      })
      lent.splice(i, 1)
      borrowed.splice(j, 1)
    }
    if (!lent.length || !borrowed.length) continue
    const lentTotal = lent.reduce(
      (sum, debt) => sum + cents(remainingAmount(debt)),
      0,
    )
    const borrowedTotal = borrowed.reduce(
      (sum, debt) => sum + cents(remainingAmount(debt)),
      0,
    )
    if (
      !Number.isSafeInteger(lentTotal) ||
      !Number.isSafeInteger(borrowedTotal)
    ) {
      limited = true
      continue
    }
    if (
      lentTotal === borrowedTotal &&
      lent.length + borrowed.length <= MAX_MATCH_DEBTS
    ) {
      matches.push({ personId, lent, borrowed, amount: lentTotal / 100 })
      continue
    }
    const ceiling = Math.min(lentTotal, borrowedTotal)
    const left = subsetSums(lent, ceiling)
    const right = subsetSums(borrowed, ceiling)
    limited ||= left.limited || right.limited
    let best = 0
    for (const sum of Array.from(left.sums.keys())) {
      if (sum > best && right.sums.has(sum)) best = sum
    }
    if (best > 0)
      matches.push({
        personId,
        lent: left.sums.get(best)!,
        borrowed: right.sums.get(best)!,
        amount: best / 100,
      })
  }
  return { matches, limited }
}
