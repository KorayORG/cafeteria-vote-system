'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import React from 'react';
import { motion } from 'framer-motion';
import { Cell } from 'recharts';

export default function DayBarChart({ day, data }: { day: string; data: { Traditional: number; Alternative: number } }) {
  const src = [{ name: day, Geleneksel: data.Traditional || 0, Alternatif: data.Alternative || 0 }]
    const [activeIdx, setActiveIdx] = React.useState<number|null>(null);
    return (
      <motion.div
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0 }}
        className="card p-4 shadow-lg bg-white/70 backdrop-blur-md"
      >
        <motion.div className="font-semibold mb-2" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          {day}
        </motion.div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={src}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Geleneksel"
                onMouseOver={(_, idx) => setActiveIdx(idx)}
                onMouseOut={() => setActiveIdx(null)}
                isAnimationActive
              >
                {src.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={activeIdx===idx ? '#fb923c' : '#fb923c99'}
                    style={{ filter: activeIdx===idx ? 'drop-shadow(0 2px 12px #fb923c66)' : undefined, transition: 'all 0.2s' }}
                  />
                ))}
              </Bar>
              <Bar dataKey="Alternatif" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
}
