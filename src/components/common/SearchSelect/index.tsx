import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  id: string
  label: string
}

interface SearchSelectProps {
  options: SelectOption[]
  value?: string
  onChange: (id: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

const SearchSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
}: SearchSelectProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.id === value)

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  )

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl flex justify-between items-center"
      >
        <span className={selected ? '' : 'text-slate-400'}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-t-xl outline-none"
          />

          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-slate-400">{t('noResult')}</div>
            )}

            {filtered.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  onChange(o.id)
                  setOpen(false)
                  setSearch('')
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-700 text-white"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSelect
