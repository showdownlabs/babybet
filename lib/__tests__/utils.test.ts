import { parseLocalDate, formatLocalDate, formatISODate, clampName, genCode } from '../utils'

describe('Date Utilities', () => {
  describe('parseLocalDate', () => {
    it('should parse YYYY-MM-DD string to local Date object', () => {
      const result = parseLocalDate('2026-02-25')
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(1) // 0-indexed, so 1 = February
      expect(result.getDate()).toBe(25)
    })

    it('should handle different months correctly', () => {
      const jan = parseLocalDate('2026-01-15')
      const dec = parseLocalDate('2026-12-31')
      
      expect(jan.getMonth()).toBe(0) // January
      expect(jan.getDate()).toBe(15)
      
      expect(dec.getMonth()).toBe(11) // December
      expect(dec.getDate()).toBe(31)
    })

    it('should not have timezone offset issues', () => {
      const date = parseLocalDate('2026-02-25')
      // Should be midnight local time
      expect(date.getHours()).toBe(0)
      expect(date.getMinutes()).toBe(0)
      expect(date.getSeconds()).toBe(0)
    })
  })

  describe('formatLocalDate', () => {
    it('should format Date object to YYYY-MM-DD string', () => {
      const date = new Date(2026, 1, 25) // Feb 25, 2026
      const result = formatLocalDate(date)
      expect(result).toBe('2026-02-25')
    })

    it('should pad single digits with zeros', () => {
      const date = new Date(2026, 0, 5) // Jan 5, 2026
      const result = formatLocalDate(date)
      expect(result).toBe('2026-01-05')
    })

    it('should handle end of month correctly', () => {
      const date = new Date(2026, 1, 28) // Feb 28, 2026
      const result = formatLocalDate(date)
      expect(result).toBe('2026-02-28')
    })
  })

  describe('parseLocalDate and formatLocalDate round-trip', () => {
    it('should maintain date integrity through parse and format cycle', () => {
      const original = '2026-02-25'
      const parsed = parseLocalDate(original)
      const formatted = formatLocalDate(parsed)
      expect(formatted).toBe(original)
    })

    it('should work for multiple dates', () => {
      const dates = [
        '2026-02-15',
        '2026-02-20',
        '2026-02-25',
        '2026-03-01',
        '2026-03-10',
      ]

      dates.forEach(dateStr => {
        const parsed = parseLocalDate(dateStr)
        const formatted = formatLocalDate(parsed)
        expect(formatted).toBe(dateStr)
      })
    })
  })

  describe('Date range generation (carousel simulation)', () => {
    it('should generate correct date sequence without skipping or duplicating', () => {
      const windowStart = parseLocalDate('2026-02-20')
      const windowEnd = parseLocalDate('2026-02-28')
      const dueDate = parseLocalDate('2026-02-25')
      
      // Simulate the carousel date generation logic
      const allDates: Date[] = []
      const current = new Date(windowStart)
      while (current <= windowEnd) {
        allDates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      
      // Verify we have the right number of dates (Feb 20-28 = 9 days)
      expect(allDates.length).toBe(9)
      
      // Verify first and last dates
      expect(formatLocalDate(allDates[0])).toBe('2026-02-20')
      expect(formatLocalDate(allDates[8])).toBe('2026-02-28')
      
      // Verify no dates are skipped
      const formattedDates = allDates.map(formatLocalDate)
      expect(formattedDates).toEqual([
        '2026-02-20',
        '2026-02-21',
        '2026-02-22',
        '2026-02-23',
        '2026-02-24',
        '2026-02-25',
        '2026-02-26',
        '2026-02-27',
        '2026-02-28',
      ])
    })

    it('should correctly identify due date in generated dates', () => {
      const windowStart = parseLocalDate('2026-02-20')
      const windowEnd = parseLocalDate('2026-02-28')
      const dueDate = parseLocalDate('2026-02-25')
      const dueDateStr = formatLocalDate(dueDate)
      
      // Generate dates
      const allDates: Date[] = []
      const current = new Date(windowStart)
      while (current <= windowEnd) {
        allDates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      
      // Check which date matches the due date
      const matchingDates = allDates.filter(date => {
        const dateStr = formatLocalDate(date)
        return dateStr === dueDateStr
      })
      
      expect(matchingDates.length).toBe(1)
      expect(formatLocalDate(matchingDates[0])).toBe('2026-02-25')
    })

    it('should not have off-by-one errors near DST boundaries', () => {
      // Test around a potential DST transition (US DST typically starts in March)
      const windowStart = parseLocalDate('2026-03-07')
      const windowEnd = parseLocalDate('2026-03-15')
      
      const allDates: Date[] = []
      const current = new Date(windowStart)
      while (current <= windowEnd) {
        allDates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      
      expect(allDates.length).toBe(9)
      
      const formattedDates = allDates.map(formatLocalDate)
      expect(formattedDates).toEqual([
        '2026-03-07',
        '2026-03-08',
        '2026-03-09',
        '2026-03-10',
        '2026-03-11',
        '2026-03-12',
        '2026-03-13',
        '2026-03-14',
        '2026-03-15',
      ])
    })
  })

  describe('formatISODate', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2026-02-25T12:00:00Z')
      const result = formatISODate(date)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should handle string input already in YYYY-MM-DD format', () => {
      const result = formatISODate('2026-02-25')
      expect(result).toBe('2026-02-25')
    })
  })

  describe('clampName', () => {
    it('should trim whitespace', () => {
      expect(clampName('  John Doe  ')).toBe('John Doe')
    })

    it('should replace multiple spaces with single space', () => {
      expect(clampName('John    Doe')).toBe('John Doe')
    })

    it('should limit length to 64 characters', () => {
      const longName = 'A'.repeat(100)
      expect(clampName(longName).length).toBe(64)
    })
  })

  describe('genCode', () => {
    it('should generate code with initials and random chars', () => {
      const code = genCode('John Doe')
      expect(code).toMatch(/^JD-[A-Z0-9]{4}$/)
    })

    it('should handle single name', () => {
      const code = genCode('John')
      expect(code).toMatch(/^J-[A-Z0-9]{4}$/)
    })

    it('should use BB as default for empty name', () => {
      const code = genCode('')
      expect(code).toMatch(/^BB-[A-Z0-9]{4}$/)
    })
  })
})

