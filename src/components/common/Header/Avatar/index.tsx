import { useState, useRef, useEffect, useContext } from 'react'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/auth'
import { AuthContext } from '@/contexts'

export default function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const signOutRef = useRef<HTMLButtonElement>(null)
  const { logout, loading } = useAuth()
  const { email } = useContext(AuthContext)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    signOutRef.current?.focus()
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      )
        setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
          avatarRef.current?.focus()
        }
      }}
    >
      <button
        ref={avatarRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-full"
        aria-label={t('ui.account')}
        aria-expanded={isOpen}
        aria-controls="account-panel"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full border border-blue-400/30 bg-blue-500/15 text-sm font-semibold text-blue-200">
          {email?.charAt(0).toLocaleUpperCase() || '?'}
        </span>
      </button>
      {isOpen && (
        <div
          id="account-panel"
          className="ui-panel absolute right-0 z-30 mt-3 w-64 max-w-[calc(100vw-2rem)] p-2 shadow-xl shadow-black/30"
        >
          <p className="break-all border-b border-slate-700 px-3 py-3 text-sm text-slate-300">
            {email}
          </p>
          <button
            ref={signOutRef}
            onClick={() => void logout()}
            disabled={loading}
            className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t('ui.signOut')}
          </button>
        </div>
      )}
    </div>
  )
}
