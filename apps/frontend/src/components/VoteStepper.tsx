// VoteStepper: handles fetching menu, stepper UI, voting logic
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, isAfter, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale/tr';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getTodayISO() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export default function VoteStepper({ shift, onSuccess, onError, audioEnabled, setAudioEnabled }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['menu', 'current'],
    queryFn: async () => {
      const res = await fetch(`${API}/menu/week/current`, { credentials: 'include' });
      if (!res.ok) throw new Error('Menü alınamadı');
      return res.json();
    }
  });
  const weekOf = data?.weekOfISO;
  const days = data?.days || [];
  const [votes, setVotes] = useLocalStorage(`vote:${weekOf}:${shift}`, []);
  const cutoff = data?.cutoffTime || '15:00';

  // Helper: is voting open for a date?
  function isVoteOpen(dateISO) {
    const now = new Date();
    const date = parseISO(dateISO);
    const [h, m] = cutoff.split(':').map(Number);
    date.setHours(h, m, 0, 0);
    return isAfter(date, now);
  }

  function handleSelect(choice) {
    const day = days[step];
    if (!day) return;
    setVotes(vs => {
      const rest = vs.filter(v => v.date !== day.date);
      return [...rest, { date: day.date, choice }];
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/votes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStart: weekOf,
          shift,
          choices: votes,
        }),
      });
      if (!res.ok) throw new Error('Oy gönderilemedi');
      setVotes([]); // clear local
      onSuccess();
    } catch (e) {
      onError();
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex flex-col gap-4 items-center mt-12 w-full max-w-lg mx-auto">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 w-full bg-muted rounded-lg animate-pulse" />
      ))}
    </div>;
  }
  if (!days.length) return <div>Menü bulunamadı.</div>;

  const day = days[step];
  const selected = votes.find(v => v.date === day.date)?.choice;
  const voteOpen = isVoteOpen(day.date);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto mt-8">
      {/* Stepper header */}
      <div className="flex gap-2 justify-center mb-2">
        {days.map((d, i) => (
          <button
            key={d.date}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${i === step ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground'}`}
            onClick={() => setStep(i)}
          >
            {format(parseISO(d.date), 'EEE', { locale: tr })}
          </button>
        ))}
      </div>
      {/* Main cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex gap-4 w-full"
        >
          {[{ type: 'traditional', dish: day.traditional, badge: 'badge-orange', label: 'Geleneksel' }, { type: 'alternative', dish: day.alternative, badge: 'badge-green', label: 'Alternatif' }].map(opt => (
            <Card
              key={opt.type}
              className={`flex-1 cursor-pointer border-2 transition-all ${selected === opt.type ? 'border-primary scale-105' : 'border-transparent hover:border-muted-foreground'}`}
              onClick={() => voteOpen && handleSelect(opt.type)}
              aria-disabled={!voteOpen}
            >
              <CardContent className="flex flex-col items-center p-4 gap-2">
                <span className={`badge ${opt.badge}`}>{opt.label}</span>
                <span className="font-bold text-lg text-center">{opt.dish?.name || '-'}</span>
                {opt.dish?.imageUrl && <img src={opt.dish.imageUrl} alt={opt.dish.name} className="w-20 h-20 object-cover rounded" />}
                <div className="flex flex-wrap gap-1 mt-1">
                  {opt.dish?.tags?.map(tag => <span key={tag} className="badge badge-outline text-xs">{tag}</span>)}
                  {opt.dish?.pairTags?.map(pt => <span key={pt.key} className="badge badge-outline text-xs">{pt.left}/{pt.right}</span>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* Footer */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="text-sm text-muted-foreground mb-1">Seçili vardiya: <b>{shift}</b> ({data.shiftLabel || ''})</div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Geri</Button>
          <Button variant="outline" onClick={() => setStep(s => Math.min(days.length - 1, s + 1))} disabled={step === days.length - 1}>İleri</Button>
        </div>
        <Button
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={submitting || votes.length === 0}
        >
          {submitting ? 'Gönderiliyor...' : 'Oylamayı Tamamla'}
        </Button>
        {!voteOpen && <div className="text-xs text-red-500 mt-2">Oy kullanım süresi doldu</div>}
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="audio-toggle" className="text-xs">Sesli bildirim</label>
          <input id="audio-toggle" type="checkbox" checked={audioEnabled} onChange={e => setAudioEnabled(e.target.checked)} />
        </div>
      </div>
    </div>
  );
}
