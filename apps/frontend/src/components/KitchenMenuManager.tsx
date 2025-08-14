// KitchenMenuManager: Haftalık menü yönetimi (gün/gün düzenleme, yayınlama)
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function KitchenMenuManager({ week }) {
  const [days, setDays] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/menu/week/${week}`, { credentials: 'include' })
      .then(r => r.json())
      .then(j => {
        setDays(j?.days || []);
        setIsPublished(j?.isPublished || false);
      })
      .finally(() => setLoading(false));
  }, [week]);

  function handleChange(idx, field, value, type) {
    setDays(ds => ds.map((d, i) => i === idx ? { ...d, [type]: { ...d[type], [field]: value } } : d));
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`${API}/menu/week`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekOfISO: week,
        isPublished,
        days: days.map(d => d._id),
        menus: days.map(d => ({
          date: d.date,
          traditional: d.traditional,
          alternative: d.alternative
        }))
      })
    });
    setSaving(false);
  }

  if (loading) return <div className="h-32 flex items-center justify-center">Yükleniyor...</div>;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold">Yayın Durumu:</span>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          <Badge color={isPublished ? 'green' : 'gray'}>{isPublished ? 'Yayında' : 'Taslak'}</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {days.map((d, idx) => (
            <Card key={d._id || d.date} className="mb-2">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="font-semibold mb-1">{new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs">Geleneksel</label>
                  <Input value={d.traditional?.name || ''} onChange={e => handleChange(idx, 'name', e.target.value, 'traditional')} placeholder="Yemek adı" />
                  <Input value={d.traditional?.imageUrl || ''} onChange={e => handleChange(idx, 'imageUrl', e.target.value, 'traditional')} placeholder="Görsel URL" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-xs">Alternatif</label>
                  <Input value={d.alternative?.name || ''} onChange={e => handleChange(idx, 'name', e.target.value, 'alternative')} placeholder="Yemek adı" />
                  <Input value={d.alternative?.imageUrl || ''} onChange={e => handleChange(idx, 'imageUrl', e.target.value, 'alternative')} placeholder="Görsel URL" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
