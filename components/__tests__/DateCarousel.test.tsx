import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import DateCarousel from '../DateCarousel'
import { parseLocalDate, formatLocalDate } from '@/lib/utils'

describe('DateCarousel', () => {
  const mockProps = {
    windowStart: parseLocalDate('2026-02-20'),
    windowEnd: parseLocalDate('2026-02-28'),
    dueDate: parseLocalDate('2026-02-25'),
    guessCounts: {
      '2026-02-21': 1,
      '2026-02-22': 2,
      '2026-02-23': 2,
      '2026-02-24': 1,
      '2026-02-25': 2,
      '2026-02-26': 1,
      '2026-02-27': 2,
      '2026-02-28': 5,
    },
    guessProfiles: {},
    guessesByDate: {},
    selectedDate: null,
    onDateSelect: jest.fn(),
    locale: 'en',
    isAuthenticated: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Due Date Display', () => {
    it('should correctly identify and display the due date', () => {
      render(<DateCarousel {...mockProps} />)
      
      // The due date should be Feb 25
      const dueDateElements = screen.getAllByText('Due Date')
      expect(dueDateElements.length).toBeGreaterThan(0)
      
      // Find the button that contains "Due Date"
      const dueDateButton = screen.getByText('Feb 25').closest('button')
      expect(dueDateButton).toBeInTheDocument()
      expect(dueDateButton).toHaveTextContent('Due Date')
    })

    it('should only mark one date as the due date', () => {
      render(<DateCarousel {...mockProps} />)
      
      const dueDateElements = screen.getAllByText('Due Date')
      expect(dueDateElements).toHaveLength(1)
    })

    it('should apply correct styling to the due date', () => {
      render(<DateCarousel {...mockProps} />)
      
      const dueDateButton = screen.getByText('Feb 25').closest('button')
      expect(dueDateButton).toHaveClass('border-blue-500')
      expect(dueDateButton).toHaveClass('bg-blue-50')
    })

    it('should not mark Feb 24 as due date when due date is Feb 25', () => {
      render(<DateCarousel {...mockProps} />)
      
      const feb24Button = screen.getByText('Feb 24').closest('button')
      expect(feb24Button).not.toHaveTextContent('Due Date')
      expect(feb24Button).not.toHaveClass('border-blue-500')
    })

    it('should correctly match due date string formatting', () => {
      const { dueDate, windowStart, windowEnd } = mockProps
      const dueDateStr = formatLocalDate(dueDate)
      
      // Verify the formatted due date is what we expect
      expect(dueDateStr).toBe('2026-02-25')
      
      // Generate all dates like the component does
      const allDates: Date[] = []
      const current = new Date(windowStart)
      while (current <= windowEnd) {
        allDates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      
      // Find which date matches the due date
      const matchingDates = allDates.filter(date => {
        const dateStr = formatLocalDate(date)
        return dateStr === dueDateStr
      })
      
      expect(matchingDates).toHaveLength(1)
      expect(formatLocalDate(matchingDates[0])).toBe('2026-02-25')
    })
  })

  describe('Date Generation', () => {
    it('should render all dates in the window', () => {
      render(<DateCarousel {...mockProps} />)
      
      // Should have 9 dates (Feb 20-28)
      expect(screen.getByText('Feb 20')).toBeInTheDocument()
      expect(screen.getByText('Feb 21')).toBeInTheDocument()
      expect(screen.getByText('Feb 22')).toBeInTheDocument()
      expect(screen.getByText('Feb 23')).toBeInTheDocument()
      expect(screen.getByText('Feb 24')).toBeInTheDocument()
      expect(screen.getByText('Feb 25')).toBeInTheDocument()
      expect(screen.getByText('Feb 26')).toBeInTheDocument()
      expect(screen.getByText('Feb 27')).toBeInTheDocument()
      expect(screen.getByText('Feb 28')).toBeInTheDocument()
    })

    it('should display correct weekdays for each date', () => {
      render(<DateCarousel {...mockProps} />)
      
      // Feb 20, 2026 is a Friday
      const feb20 = screen.getByText('Feb 20').closest('button')
      expect(feb20).toHaveTextContent('Fri')
      
      // Feb 25, 2026 is a Wednesday
      const feb25 = screen.getByText('Feb 25').closest('button')
      expect(feb25).toHaveTextContent('Wed')
    })

    it('should show correct bet counts for each date', () => {
      render(<DateCarousel {...mockProps} />)
      
      expect(screen.getAllByText('1 bet').length).toBeGreaterThan(0)
      expect(screen.getAllByText('2 bets').length).toBeGreaterThan(0)
      expect(screen.getByText('5 bets')).toBeInTheDocument()
    })
  })

  describe('Date Selection', () => {
    it('should call onDateSelect when a date is clicked', () => {
      const onDateSelect = jest.fn()
      render(<DateCarousel {...mockProps} onDateSelect={onDateSelect} />)
      
      const feb25Button = screen.getByText('Feb 25').closest('button')
      if (feb25Button) {
        fireEvent.click(feb25Button)
        expect(onDateSelect).toHaveBeenCalledWith('2026-02-25')
      }
    })

    it('should highlight selected date', () => {
      render(<DateCarousel {...mockProps} selectedDate="2026-02-25" />)
      
      const feb25Button = screen.getByText('Feb 25').closest('button')
      expect(feb25Button).toHaveClass('border-black')
      expect(feb25Button).toHaveClass('bg-black')
      expect(feb25Button).toHaveClass('text-white')
    })
  })

  describe('Edge Cases', () => {
    it('should handle month boundaries correctly', () => {
      const props = {
        ...mockProps,
        windowStart: parseLocalDate('2026-02-28'),
        windowEnd: parseLocalDate('2026-03-03'),
        dueDate: parseLocalDate('2026-03-01'),
      }
      
      render(<DateCarousel {...props} />)
      
      expect(screen.getByText('Feb 28')).toBeInTheDocument()
      expect(screen.getByText('Mar 1')).toBeInTheDocument()
      expect(screen.getByText('Mar 2')).toBeInTheDocument()
      expect(screen.getByText('Mar 3')).toBeInTheDocument()
      
      // March 1 should be the due date
      const mar1Button = screen.getByText('Mar 1').closest('button')
      expect(mar1Button).toHaveTextContent('Due Date')
    })

    it('should handle single day window', () => {
      const props = {
        ...mockProps,
        windowStart: parseLocalDate('2026-02-25'),
        windowEnd: parseLocalDate('2026-02-25'),
        dueDate: parseLocalDate('2026-02-25'),
        guessCounts: { '2026-02-25': 5 },
      }
      
      render(<DateCarousel {...props} />)
      
      expect(screen.getByText('Feb 25')).toBeInTheDocument()
      expect(screen.getByText('Due Date')).toBeInTheDocument()
      expect(screen.getByText('5 bets')).toBeInTheDocument()
    })
  })

  describe('Date String Consistency', () => {
    it('should maintain consistent date format throughout component', () => {
      const { dueDate } = mockProps
      const dueDateStr = formatLocalDate(dueDate)
      
      // This test verifies the exact issue reported
      // The due date should format to '2026-02-25', not '2026-02-24'
      expect(dueDateStr).toBe('2026-02-25')
      
      // Verify that parsing and formatting maintains the same date
      const parsedDueDate = parseLocalDate('2026-02-25')
      const formattedDueDate = formatLocalDate(parsedDueDate)
      expect(formattedDueDate).toBe('2026-02-25')
    })

    it('should not have off-by-one errors in date comparison', () => {
      const dueDate = parseLocalDate('2026-02-25')
      const feb24 = parseLocalDate('2026-02-24')
      const feb25 = parseLocalDate('2026-02-25')
      const feb26 = parseLocalDate('2026-02-26')
      
      const dueDateStr = formatLocalDate(dueDate)
      
      expect(formatLocalDate(feb24)).not.toBe(dueDateStr)
      expect(formatLocalDate(feb25)).toBe(dueDateStr)
      expect(formatLocalDate(feb26)).not.toBe(dueDateStr)
    })
  })
})

