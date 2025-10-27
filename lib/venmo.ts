import { config } from './config'
import { formatLocalDate } from './utils'

export function buildVenmoNote(name: string, dateISO: string, code: string) {
  return config.venmoNoteTemplate
    .replace('{name}', name)
    .replace('{date}', dateISO)
    .replace('{code}', code)
    .replace('{dueDate}', formatLocalDate(config.dueDate))
}

export function venmoLinks(note: string) {
  const recipient = encodeURIComponent(config.venmoRecipient)
  const amount = encodeURIComponent(config.venmoAmount)
  const encNote = encodeURIComponent(note)
  const deep = `venmo://paycharge?txn=pay&recipients=${recipient}&amount=${amount}&note=${encNote}`
  const web = `https://venmo.com/?txn=pay&recipients=${recipient}&amount=${amount}&note=${encNote}`
  return { deep, web }
}

