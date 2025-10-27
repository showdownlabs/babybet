/**
 * Integration test to verify end-to-end date handling
 */

import { parseLocalDate, formatLocalDate } from '../utils'

describe('End-to-End Date Flow', () => {
  it('should handle the complete flow from database to display', () => {
    // 1. Simulate database return value (PostgreSQL returns date as string)
    const dbDueDate = '2026-02-25'
    const dbWindowStart = '2026-02-20'
    const dbWindowEnd = '2026-02-28'
    
    // 2. Parse like the page does (app/[locale]/[baby_slug]/page.tsx line 125-127)
    const dueDate = parseLocalDate(dbDueDate)
    const windowStart = parseLocalDate(dbWindowStart)
    const windowEnd = parseLocalDate(dbWindowEnd)
    
    // 3. Generate dates like DateCarousel does (line 49-54)
    const allDates: Date[] = []
    const current = new Date(windowStart)
    while (current <= windowEnd) {
      allDates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    // 4. Check due date like DateCarousel does (line 56, 129)
    const dueDateStr = formatLocalDate(dueDate)
    
    // 5. Find which date in the carousel matches
    const matchingIndex = allDates.findIndex(date => {
      const dateStr = formatLocalDate(date)
      return dateStr === dueDateStr
    })
    
    console.log('\n=== Integration Test Results ===')
    console.log(`Database due date: ${dbDueDate}`)
    console.log(`Parsed due date formatted: ${dueDateStr}`)
    console.log(`Matching carousel index: ${matchingIndex} (should be 5 for Feb 25)`)
    console.log(`Carousel dates:`)
    allDates.forEach((date, idx) => {
      const dateStr = formatLocalDate(date)
      const isDue = dateStr === dueDateStr
      console.log(`  ${idx}: ${dateStr} ${isDue ? '← DUE DATE' : ''}`)
    })
    
    // Assertions
    expect(dueDateStr).toBe('2026-02-25')
    expect(matchingIndex).toBe(5) // Feb 25 is the 6th date (index 5)
    expect(formatLocalDate(allDates[5])).toBe('2026-02-25')
    
    // This should NOT happen
    expect(formatLocalDate(allDates[4])).not.toBe('2026-02-25')
    expect(formatLocalDate(allDates[4])).toBe('2026-02-24')
  })

  it('should identify if timezone issues occur', () => {
    const dbDate = '2026-02-25'
    
    // Method 1: Our parseLocalDate (correct)
    const method1 = parseLocalDate(dbDate)
    const result1 = formatLocalDate(method1)
    
    // Method 2: Direct new Date (WRONG - creates UTC date)
    const method2 = new Date(dbDate)
    const result2 = formatLocalDate(method2)
    
    // Method 3: With explicit time (correct for local)
    const method3 = new Date(`${dbDate}T00:00:00`)
    const result3 = formatLocalDate(method3)
    
    console.log('\n=== Method Comparison ===')
    console.log(`parseLocalDate: ${result1}`)
    console.log(`new Date(string): ${result2} ${result2 !== dbDate ? '⚠️  OFF BY ONE!' : '✓'}`)
    console.log(`new Date with time: ${result3}`)
    
    // parseLocalDate should always work
    expect(result1).toBe('2026-02-25')
    
    // Direct new Date might fail depending on timezone
    // In PST/PDT (UTC-7/8), '2026-02-25' as UTC becomes Feb 24 local
  })
})

