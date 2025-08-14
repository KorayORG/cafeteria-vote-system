// KitchenStats: Haftalık istatistikler, week picker, charts
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { format, addWeeks, parseISO, startOfWeek, getISOWeek } from 'date-fns';
import { tr } from 'date-fns/locale/tr';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getCurrentISOWeek() {
  const now = new Date();
  return `${now.getFullYear()}-W${String(getISOWeek(now)).padStart(2, '0')}`;
}

export default function KitchenStats({ week, setWeek }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isoWeek, setIsoWeek] = useState(week || getCurrentISOWeek());

  useEffect(() => { if (week) setIsoWeek(week); }, [week]);
  useEffect(() => { setWeek?.(isoWeek); }, [isoWeek]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/stats/week/${isoWeek}`, { credentials: 'include' })
      .then(r => r.json())
      .then(j => setData(j?.days || []))
      .finally(() => setLoading(false));
  }, [isoWeek]);

  function prevWeek() {
    const [y, w] = isoWeek.split('-W');
    const d = startOfWeek(new Date(Number(y), 0, (Number(w) - 1) * 7 + 1), { weekStartsOn: 1 });
    const prev = addWeeks(d, -1);
    setIsoWeek(`${prev.getFullYear()}-W${String(getISOWeek(prev)).padStart(2, '0')}`);
  }
  function nextWeek() {
    const [y, w] = isoWeek.split('-W');
    const d = startOfWeek(new Date(Number(y), 0, (Number(w) - 1) * 7 + 1), { weekStartsOn: 1 });
    const next = addWeeks(d, 1);
    setIsoWeek(`${next.getFullYear()}-W${String(getISOWeek(next)).padStart(2, '0')}`);
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={prevWeek}>Önceki Hafta</Button>
          <div className="font-semibold text-lg">Hafta: {isoWeek}</div>
          <Button variant="outline" onClick={nextWeek}>Sonraki Hafta</Button>
        </div>
        {loading ? (
          <div className="h-48 flex items-center justify-center">Yükleniyor...</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
              <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), 'EEE', { locale: tr })} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v) => v} />
              <Bar dataKey="traditionalCount" fill="#fb923c">
                <LabelList dataKey="traditionalCount" position="top" />
              </Bar>
              <Bar dataKey="alternativeCount" fill="#22c55e">
                <LabelList dataKey="alternativeCount" position="top" />
              </Bar>
              {/* Overlay for adjustments if present */}
              {/* Add more overlays/labels as needed */}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
