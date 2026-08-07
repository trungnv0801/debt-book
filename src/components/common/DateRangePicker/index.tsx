import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  addMonths,
  buildMonthGrid,
  getWeekdayLabels,
  isSameDay,
  parseISODate,
  stripTime,
  toISODate,
} from '@/utils'
import type { DayCell } from '@/types'

interface DateRangePickerProps {
  id?: string
  startDate: string
  endDate: string
  onChange: (startDate: string, endDate: string) => void
  placeholder?: string
}

const DateRangePicker = ({
  id,
  startDate,
  endDate,
  onChange,
  placeholder,
}: DateRangePickerProps) => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState(() => stripTime(new Date()))
  const [align, setAlign] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => stripTime(new Date()), [])

  const [prevSync, setPrevSync] = useState({ open, startDate, endDate })
  if (
    open !== prevSync.open ||
    startDate !== prevSync.startDate ||
    endDate !== prevSync.endDate
  ) {
    const wasOpen = prevSync.open
    setPrevSync({ open, startDate, endDate })
    if (open) {
      const start = parseISODate(startDate)
      const end = parseISODate(endDate)
      setRangeStart(start)
      setRangeEnd(end)
      setHoverDate(null)
      if (!wasOpen) {
        const anchor = start || today
        setViewMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
      }
    }
  }

  useLayoutEffect(() => {
    if (!open) return

    const updateAlign = () => {
      const container = containerRef.current
      const panel = panelRef.current
      if (!container || !panel) return
      const containerRect = container.getBoundingClientRect()
      const panelWidth = panel.offsetWidth
      const overflowsRight = containerRect.left + panelWidth > window.innerWidth
      setAlign(overflowsRight ? 'right' : 'left')
    }

    updateAlign()
    window.addEventListener('resize', updateAlign)
    return () => window.removeEventListener('resize', updateAlign)
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const rightMonth = useMemo(() => addMonths(viewMonth, 1), [viewMonth])
  const leftDays = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])
  const rightDays = useMemo(() => buildMonthGrid(rightMonth), [rightMonth])
  const weekdayLabels = useMemo(
    () => getWeekdayLabels(i18n.language),
    [i18n.language],
  )

  const effectiveEnd = rangeEnd || hoverDate
  const lo =
    rangeStart && effectiveEnd
      ? rangeStart < effectiveEnd
        ? rangeStart
        : effectiveEnd
      : null
  const hi =
    rangeStart && effectiveEnd
      ? rangeStart > effectiveEnd
        ? rangeStart
        : effectiveEnd
      : null

  const handleDayClick = (date: Date) => {
    if (!rangeStart || rangeEnd) {
      setRangeStart(date)
      setRangeEnd(null)
      setHoverDate(null)
    } else if (date < rangeStart) {
      setRangeEnd(rangeStart)
      setRangeStart(date)
      setHoverDate(null)
    } else {
      setRangeEnd(date)
      setHoverDate(null)
    }
  }

  const handleApply = () => {
    if (rangeStart && rangeEnd) {
      onChange(toISODate(rangeStart), toISODate(rangeEnd))
      setOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('', '')
  }

  const hasValue = !!(startDate && endDate)

  const renderMonth = (
    monthDate: Date,
    days: DayCell[],
    side: 'left' | 'right',
  ) => (
    <div className="w-full sm:w-60">
      <div className="flex items-center justify-between mb-2">
        {side === 'left' ? (
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            aria-label="Previous month"
            className="w-7 h-7 grid place-items-center rounded-md text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <span className="w-7 h-7" />
        )}
        <span className="text-sm font-semibold text-white">
          {monthDate.toLocaleDateString(i18n.language, {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        {side === 'right' ? (
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="w-7 h-7 grid place-items-center rounded-md text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="w-7 h-7" />
        )}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {weekdayLabels.map((label, i) => (
          <span
            key={i}
            className="flex items-center justify-center h-7 text-[11px] font-semibold uppercase text-slate-400"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((cell, i) => {
          if (!cell.date) return <div key={i} className="h-8" />

          const d = cell.date
          const inRange = !!(lo && hi && d >= lo && d <= hi)
          const isRangeStart = inRange && isSameDay(d, lo)
          const isRangeEnd = inRange && isSameDay(d, hi)
          const selected = isSameDay(d, rangeStart) || isSameDay(d, rangeEnd)

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center h-8 ${
                inRange ? 'bg-blue-500/20' : ''
              } ${isRangeStart ? 'rounded-l-full' : ''} ${isRangeEnd ? 'rounded-r-full' : ''}`}
            >
              <button
                type="button"
                onClick={() => handleDayClick(d)}
                onMouseEnter={() => rangeStart && !rangeEnd && setHoverDate(d)}
                className={`relative z-10 w-8 h-8 rounded-full text-xs transition ${
                  selected
                    ? 'bg-blue-500 text-white font-semibold'
                    : isSameDay(d, today)
                      ? 'text-white ring-1 ring-blue-400'
                      : 'text-slate-200 hover:bg-slate-600'
                }`}
              >
                {d.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 bg-slate-700 text-white px-4 py-3 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500"
      >
        <span className={`truncate ${hasValue ? '' : 'text-slate-400'}`}>
          {hasValue
            ? startDate === endDate
              ? startDate
              : `${startDate} → ${endDate}`
            : placeholder || t('dateRangePicker.placeholder')}
        </span>
        <CalendarDays className="w-4 h-4 shrink-0 text-slate-400" />
      </button>

      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t('clear')}
          className="absolute right-9 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-slate-400 transition hover:bg-slate-600 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className={`absolute z-20 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-4 w-max max-w-[calc(100vw-2rem)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {renderMonth(viewMonth, leftDays, 'left')}
            {renderMonth(rightMonth, rightDays, 'right')}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-700">
            <span className="text-xs text-slate-400">
              {rangeStart && rangeEnd
                ? `${toISODate(rangeStart)} → ${toISODate(rangeEnd)}`
                : rangeStart
                  ? t('dateRangePicker.selectEnd')
                  : t('dateRangePicker.selectStart')}
            </span>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!(rangeStart && rangeEnd)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-500 text-white transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
