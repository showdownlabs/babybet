'use client'
import { useRef, useState, useEffect } from 'react'
import DateGuessDetails from './DateGuessDetails'

type Guess = {
  id: string
  name: string
  paid: boolean
  created_at: string
  payment_provider: string
  user_id: string | null
  profiles?: {
    avatar_url: string | null
  } | null
}

type DateCarouselProps = {
  windowStart: Date
  windowEnd: Date
  dueDate: Date
  guessCounts: Record<string, number>
  guessProfiles: Record<string, string[]>
  guessesByDate: Record<string, Guess[]>
  selectedDate: string | null
  onDateSelect: (date: string) => void
  locale: string
  isAuthenticated: boolean
}

export default function DateCarousel({
  windowStart,
  windowEnd,
  dueDate,
  guessCounts,
  guessProfiles,
  guessesByDate,
  selectedDate,
  onDateSelect,
  locale,
  isAuthenticated,
}: DateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

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
            const avatars = guessProfiles[dateStr] || []

            return (
              <div key={dateStr} className="flex-shrink-0 snap-center relative">
                <button
                  type="button"
                  data-date={dateStr}
                  onClick={() => onDateSelect(dateStr)}
                  className={`
                    flex flex-col items-center justify-center
                    w-24 h-28 rounded-xl border-2 transition-all relative
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
                  
                  {/* Profile avatars */}
                  {avatars.length > 0 && (
                    <div className="flex -space-x-2 mt-1">
                      {avatars.slice(0, 3).map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar}
                          alt="User"
                          className="w-5 h-5 rounded-full border-2 border-white"
                        />
                      ))}
                      {avatars.length > 3 && (
                        <div className={`
                          w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium
                          ${isSelected ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'}
                        `}>
                          +{avatars.length - 3}
                        </div>
                      )}
                    </div>
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
                
                {/* Info button to expand details - only for authenticated users */}
                {count > 0 && isAuthenticated && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedDate(expandedDate === dateStr ? null : dateStr)
                    }}
                    className={`
                      absolute -top-1 -right-1 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all
                      ${expandedDate === dateStr
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50'
                      }
                    `}
                    title="View details"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
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
        Scroll to see all dates • Blue border = due date
        {isAuthenticated && ' • Click ⓘ to see who guessed each date'}
      </p>

      {/* Expanded date details */}
      {expandedDate && guessesByDate[expandedDate] && (
        <DateGuessDetails
          date={expandedDate}
          guesses={guessesByDate[expandedDate]}
          locale={locale}
          onClose={() => setExpandedDate(null)}
        />
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

