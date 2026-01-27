import { X } from 'lucide-react'
import { useEffect } from 'react'

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
  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative w-full ${widthClass} mx-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-700`}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose}>
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
