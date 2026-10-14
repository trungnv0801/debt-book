import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Debt } from '@/types/debt'
import { allocateRepayment, remainingAmount } from '@/utils/repayment'
import Modal from '@/components/common/Modal'
import { formatAmount, formatCurrency } from '../shared'

interface Props {
  personName?: string
  debts: Debt[]
  onSave: (ids: string[], amount: number | 'full') => Promise<boolean>
  onClose: () => void
}

export default function RepaymentDialog({
  debts,
  personName,
  onSave,
  onClose,
}: Props) {
  const { t, i18n } = useTranslation()
  const [amount, setAmount] = useState(0)
  const [full, setFull] = useState(false)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const saving = useRef(false)
  const total = debts.reduce((sum, debt) => sum + remainingAmount(debt), 0)
  const requested = full ? total : amount
  let allocations: ReturnType<typeof allocateRepayment> = []
  try {
    allocations = allocateRepayment(debts, requested)
  } catch {
    // An empty preview disables submission until a valid amount is entered.
  }
  const close = () => {
    if (!saving.current) onClose()
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (saving.current || !allocations.length) return
    saving.current = true
    setPending(true)
    setFailed(false)
    try {
      if (
        await onSave(
          debts.map((debt) => debt.id),
          full ? 'full' : amount,
        )
      )
        onClose()
      else setFailed(true)
    } catch {
      setFailed(true)
    } finally {
      saving.current = false
      setPending(false)
    }
  }
  return (
    <Modal open onClose={close} title={t('debt.repayment.title')}>
      <form onSubmit={(event) => void submit(event)} className="space-y-4">
        {personName && <p className="font-semibold text-white">{personName}</p>}
        <p className="text-slate-300">
          {t('debt.repayment.remaining')}: {formatCurrency(total)}
        </p>
        {debts.length > 1 && (
          <p className="text-sm text-slate-400">
            {t('debt.repayment.oldestFirst')}
          </p>
        )}
        <fieldset disabled={pending} className="space-y-4">
          <label className="flex min-h-11 items-center gap-3 text-slate-200">
            <input
              type="checkbox"
              checked={full}
              onChange={(event) => setFull(event.target.checked)}
            />
            {t('debt.repayment.full')}
          </label>
          <label className="block text-sm text-slate-300">
            {t('debt.repayment.amount')}
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              disabled={full}
              value={formatAmount(requested)}
              onChange={(event) =>
                setAmount(Number(event.target.value.replace(/[^0-9]/g, '')))
              }
              aria-invalid={amount > 0 && !allocations.length}
              className="mt-2 w-full rounded-xl bg-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          {requested > 0 && !allocations.length && (
            <p role="alert" className="text-red-300">
              {t('debt.repayment.invalid')}
            </p>
          )}
          {!!allocations.length && (
            <div className="space-y-2 text-sm text-slate-300">
              <p className="font-semibold">{t('debt.repayment.preview')}</p>
              {allocations.map((allocation) => {
                const debt = debts.find(
                  (item) => item.id === allocation.debtId,
                )!
                return (
                  <div key={debt.id} className="rounded-lg bg-slate-800 p-3">
                    <p>
                      {new Date(debt.date).toLocaleDateString(i18n.language)}
                      {debt.note && ` · ${debt.note}`}
                    </p>
                    <p>
                      {formatCurrency(allocation.amount)} ·{' '}
                      {t('debt.repayment.remaining')}:{' '}
                      {formatCurrency(debt.amount - allocation.paidAmount)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
          {failed && (
            <p role="alert" className="text-red-300">
              {t('debt.repayment.failed')}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={close} className="ui-secondary">
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!allocations.length}
              className="ui-primary disabled:opacity-50"
            >
              {t(pending ? 'debt.repayment.saving' : 'debt.repayment.confirm')}
            </button>
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}
