export function uid(prefix = 'ev') {
  // Good enough for frontend-local storage
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
