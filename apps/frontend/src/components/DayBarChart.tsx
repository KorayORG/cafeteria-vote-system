'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function DayBarChart({ day, data }: { day: string; data: { Traditional: number; Alternative: number } }) {
  const src = [{ name: day, Geleneksel: data.Traditional || 0, Alternatif: data.Alternative || 0 }]
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{day}</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={src}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Geleneksel" />
            <Bar dataKey="Alternatif" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
