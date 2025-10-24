'use client'
import { useRef, useState, useEffect } from 'react'

type DateCarouselProps = {
  windowStart: Date
  windowEnd: Date
  dueDate: Date
  guessCounts: Record<string, number>
  selectedDate: string | null
  onDateSelect: (date: string) => void
}

export default function DateCarousel({
  windowStart,
  windowEnd,
  dueDate,
  guessCounts,
  selectedDate,
  onDateSelect,
}: DateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Generate all dates in the window
  const allDates: Date[] = []
  const current = new Date(windowStart)
  while (current <= windowEnd) {
    allDates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const dueDateStr = dueDate.toISOString().slice(0, 10)

  // Check scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    // Scroll due date into view on mount
    if (scrollRef.current && !selectedDate) {
      const dueDateElement = scrollRef.current.querySelector(`[data-date="${dueDateStr}"]`)
      if (dueDateElement) {
        dueDateElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [dueDateStr, selectedDate])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="relative">
      <label className="block mb-2">
        <span className="text-sm font-medium">Pick your date</span>
      </label>

      <div className="relative group">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-opacity"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Date carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {allDates.map((date) => {
            const dateStr = date.toISOString().slice(0, 10)
            const isDueDate = dateStr === dueDateStr
            const isSelected = dateStr === selectedDate
            const count = guessCounts[dateStr] || 0

            return (
              <button
                key={dateStr}
                type="button"
                data-date={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`
                  flex-shrink-0 snap-center
                  flex flex-col items-center justify-center
                  w-20 h-24 rounded-xl border-2 transition-all
                  ${isSelected
                    ? 'border-black bg-black text-white shadow-lg scale-105'
                    : isDueDate
                    ? 'border-blue-500 bg-blue-50 text-blue-900 hover:bg-blue-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <span className="text-xs font-medium opacity-70">
                  {formatWeekday(date)}
                </span>
                <span className="text-lg font-bold my-1">
                  {formatDate(date)}
                </span>
                {isDueDate && (
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                    Due Date
                  </span>
                )}
                {count > 0 && (
                  <span
                    className={`
                      text-xs mt-1 px-2 py-0.5 rounded-full font-medium
                      ${isSelected
                        ? 'bg-white text-black'
                        : isDueDate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {count} {count === 1 ? 'bet' : 'bets'}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-opacity"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Scroll to see all dates • Blue border = due date • Bet counts shown below each date
      </p>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

