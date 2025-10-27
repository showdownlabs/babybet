export function clampName(raw: string) {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 64)
}

export function genCode(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'BB'
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${initials}-${rnd}`
}

export function formatISODate(d: Date | string) {
  if (typeof d === 'string') {
    // If already a string, just return it if it's in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) {
      return d.slice(0, 10)
    }
    // Otherwise convert to Date first
    d = new Date(d)
  }
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function parseLocalDate(dateStr: string): Date {
  // Parse a YYYY-MM-DD string as a local date (not UTC)
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatLocalDate(date: Date): string {
  // Format a Date object to YYYY-MM-DD in local timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

