import React, { useState, useRef, useEffect } from 'react'

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

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
          <img
            className="h-10 w-10 rounded-full"
            src="https://tailwindcss.com/plus-assets/img/testimonials/ben-barbersmith.jpg"
            alt="User Avatar"
          />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="bg-gradient-to-br origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-100"
              role="menuitem"
            >
              Your Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-100"
              role="menuitem"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-100"
              role="menuitem"
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarDropdown
