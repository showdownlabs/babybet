/**
 * This test simulates how dates might be returned from PostgreSQL
 * and checks for timezone-related issues
 */

import { parseLocalDate, formatLocalDate } from '../utils'

describe('Database Date Handling', () => {
  it('should handle PostgreSQL date strings correctly', () => {
    // PostgreSQL returns dates as YYYY-MM-DD strings
    const postgresDate = '2026-02-25'
    
    // Parse it using our utility
    const parsed = parseLocalDate(postgresDate)
    const formatted = formatLocalDate(parsed)
    
    // Should maintain the same date
    expect(formatted).toBe('2026-02-25')
  })

  it('should not have timezone issues with Date constructor', () => {
    // When you do `new Date(string)`, JavaScript parses it as UTC midnight
    // This can cause off-by-one errors in some timezones
    
    const utcDate = new Date('2026-02-25') // Parsed as UTC
    const localDate = parseLocalDate('2026-02-25') // Parsed as local
    
    // Our parseLocalDate should always give us Feb 25
    expect(localDate.getDate()).toBe(25)
    expect(localDate.getMonth()).toBe(1) // February (0-indexed)
    expect(formatLocalDate(localDate)).toBe('2026-02-25')
    
    // But the UTC Date might be different depending on timezone
    console.log('UTC Date:', utcDate.toISOString())
    console.log('Local Date parsed correctly:', formatLocalDate(localDate))
  })

  it('should reproduce the carousel issue if dates are parsed incorrectly', () => {
    // Simulate what might be happening in production
    const dueDateFromDB = '2026-02-25' // From database
    
    // WRONG WAY - using new Date() directly
    const wrongParsed = new Date(dueDateFromDB)
    
    // RIGHT WAY - using parseLocalDate
    const correctParsed = parseLocalDate(dueDateFromDB)
    
    console.log('\nWRONG:', formatLocalDate(wrongParsed))
    console.log('RIGHT:', formatLocalDate(correctParsed))
    
    // The correct way should always give us 2026-02-25
    expect(formatLocalDate(correctParsed)).toBe('2026-02-25')
  })

  it('should identify the exact issue from the screenshot', () => {
    // From your screenshot:
    // - Header shows: "Due date: 2026-02-25"
    // - But carousel shows Feb 24 as "Due Date"
    
    // This suggests the dueDate being passed to DateCarousel
    // might be off by one day
    
    const headerDate = '2026-02-25'
    const parsed = parseLocalDate(headerDate)
    const formatted = formatLocalDate(parsed)
    
    // These should match
    expect(formatted).toBe('2026-02-25')
    
    // If they don't match, it means somewhere in the code
    // the date is being parsed incorrectly (probably using new Date())
  })

  it('should check if toISOString causes issues', () => {
    const localDate = parseLocalDate('2026-02-25')
    
    // toISOString() converts to UTC, which might cross a day boundary
    const isoString = localDate.toISOString()
    console.log('ISO String:', isoString)
    
    // But formatLocalDate should still work correctly
    expect(formatLocalDate(localDate)).toBe('2026-02-25')
    
    // The issue would occur if someone does:
    const wrong = new Date(isoString.slice(0, 10)) // Takes just the date part
    console.log('Wrong formatting from ISO:', formatLocalDate(wrong))
  })
})

