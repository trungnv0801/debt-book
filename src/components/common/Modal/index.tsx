import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  widthClass?: string
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  children,
  widthClass = 'max-w-md',
}) => {
  const { t } = useTranslation()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      previousFocus?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const controls = panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        )
        const first = controls?.[0]
        const last = controls?.[controls.length - 1]
        if (!first) {
          e.preventDefault()
          return
        }
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panelRef.current)
        ) {
          e.preventDefault()
          last?.focus()
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === panelRef.current)
        ) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : t('ui.dialog')}
        tabIndex={-1}
        className={`ui-panel relative max-h-[calc(100dvh-2rem)] w-full ${widthClass} overflow-y-auto shadow-xl`}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h3 id={titleId} className="text-lg font-semibold text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              aria-label={t('cancel')}
              className="ui-icon-button"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}

        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
