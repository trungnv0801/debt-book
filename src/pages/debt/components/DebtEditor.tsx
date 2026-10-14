import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import type { Debt } from '@/types/debt'
import type { DebtWorkspaceContext } from '../shared/workspace'
import { INITIAL_DEBT } from '../shared'
import DebtForm from './DebtForm'

interface Props {
  debt?: Debt
  personId?: string
  debtHook: DebtWorkspaceContext['debtHook']
  personsHook: DebtWorkspaceContext['personsHook']
  onClose: () => void
}

export default function DebtEditor({
  debt,
  personId,
  debtHook,
  personsHook,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const dialog = useRef<HTMLDialogElement>(null)
  const saving = useRef(false)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [newDebt, setNewDebt] = useState<Debt>(() => {
    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    return debt ?? { ...INITIAL_DEBT, date }
  })
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>(() =>
    debt ? [debt.personId] : personId ? [personId] : [],
  )
  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [])
  const close = () => {
    if (!saving.current) onClose()
  }
  const submit = async () => {
    if (
      saving.current ||
      !selectedPersonIds.length ||
      !newDebt.amount ||
      !newDebt.date
    )
      return
    saving.current = true
    setPending(true)
    setFailed(false)
    try {
      const { type, amount, date, dueDate, note } = newDebt
      const data = { type, amount, date, dueDate, note: note.trim() }
      const result = newDebt.id
        ? await debtHook.editDebt(newDebt.id, {
            ...data,
            personId: selectedPersonIds[0],
          })
        : await debtHook.addMultipleDebts(
            selectedPersonIds.map((id) => ({ ...data, personId: id })),
          )
      if (result) onClose()
      else setFailed(true)
    } catch {
      setFailed(true)
    } finally {
      saving.current = false
      setPending(false)
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-label={t(
        newDebt.id ? 'debt.updateTransaction' : 'debt.addTransaction',
      )}
      onKeyDownCapture={(event) => {
        if (
          event.key === 'Escape' &&
          dialog.current?.querySelector('[data-person-manager]')
        )
          event.preventDefault()
      }}
      onCancel={(event) => {
        event.preventDefault()
        if (!dialog.current?.querySelector('[data-person-manager]')) close()
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-y-auto bg-slate-900 p-4 text-white backdrop:bg-black/60 sm:left-auto sm:ml-auto sm:w-[48rem] sm:max-w-[calc(100vw-3rem)] sm:p-6"
    >
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          disabled={pending}
          onClick={close}
          aria-label={t('cancel')}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {failed && (
        <p role="alert" className="mb-4 text-red-300">
          {t('debt.workspace.saveFailed')}
        </p>
      )}
      <fieldset disabled={pending} aria-busy={pending}>
        <DebtForm
          newDebt={newDebt}
          selectedPersonIds={selectedPersonIds}
          personsHook={personsHook}
          setNewDebt={setNewDebt}
          setSelectedPersonIds={setSelectedPersonIds}
          handleSubmit={() => void submit()}
          setShowAddForm={close}
        />
      </fieldset>
    </dialog>
  )
}
