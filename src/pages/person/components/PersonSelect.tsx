import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { Person } from '@/types/person'

interface PersonSelectProps {
  persons: Person[]
  value: string
  onChange: (id: string) => void
  onAdd: () => void
  placeholder: string
}

const PersonSelect: React.FC<PersonSelectProps> = ({
  persons,
  value,
  onChange,
  onAdd,
  placeholder,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = persons.find((p) => p.id === value)

  const filtered = useMemo(
    () =>
      persons.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [persons, search],
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
    <div ref={containerRef} className="flex gap-2 w-full relative">
      <div className="flex-1 relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl flex justify-between items-center"
        >
          <span className={selected ? '' : 'text-slate-400'}>
            {selected?.name || placeholder}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search person..."
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-t-xl outline-none"
            />

            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-slate-400">No results</div>
              )}

              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(p.id)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-700 text-white"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-12 shrink-0 bg-slate-700 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  )
}

export default PersonSelect
