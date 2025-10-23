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

export function formatISODate(d: Date) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

