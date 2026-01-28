import { useState, useRef, useEffect, useContext } from 'react'
import { useAuth } from '@/hooks/auth'
import { AuthContext } from '@/contexts'

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const { logout, loading } = useAuth()
  const { email } = useContext(AuthContext)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-end">
      <div className="relative">
        <button
          ref={avatarRef}
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="User menu"
          aria-haspopup="true"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-600 text-white font-semibold">
            {email?.charAt(0).toLocaleUpperCase()}
          </div>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="bg-gradient-to-br origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <button
              onClick={logout}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarDropdown
