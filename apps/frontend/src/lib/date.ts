export function weekStartISO(d: Date = new Date()) {
  const day = d.getDay() || 7 // Pazar -> 7
  const monday = new Date(d)
  monday.setHours(0,0,0,0)
  if (day !== 1) monday.setDate(monday.getDate() - (day - 1))
  return monday.toISOString()
}

export const WEEK_DAYS = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'] as const
