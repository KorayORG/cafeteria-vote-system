"use client";
import { logTelemetry } from '@/lib/telemetry';
// VoteStepper: handles fetching menu, stepper UI, voting logic
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import { format, isAfter, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { DuelPicker, shuffleSides } from '@/components/DuelPicker';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getTodayISO() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export default function VoteStepper({ shift, onSuccess, onError, audioEnabled, setAudioEnabled }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pairs, setPairs] = useState<any[]>([]); // randomized pairs for each day
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

  // Randomize pairs once per week/shift
  useEffect(() => {
    if (!days.length) return;
    const newPairs = days.map(d => shuffleSides(
      {
        id: d.traditional?._id || 'traditional',
        label: 'Geleneksel',
        name: d.traditional?.name || '-',
        imageUrl: d.traditional?.imageUrl,
        tags: d.traditional?.tags || [],
      },
      {
        id: d.alternative?._id || 'alternative',
        label: 'Alternatif',
        name: d.alternative?.name || '-',
        imageUrl: d.alternative?.imageUrl,
        tags: d.alternative?.tags || [],
      }
    ));
    setPairs(newPairs);
    // Log impression for each pair
    newPairs.forEach((pair, i) => {
      logTelemetry({
        type: 'impression',
        date: days[i].date,
        shift,
        side: pair.left.label === 'Geleneksel' ? 'left' : 'right',
        week: weekOf,
        timestamp: Date.now(),
      });
    });
    // eslint-disable-next-line
  }, [weekOf, shift, days.length]);

  // Helper: is voting open for a date?
  function isVoteOpen(dateISO) {
    const now = new Date();
    const date = parseISO(dateISO);
    const [h, m] = cutoff.split(':').map(Number);
    date.setHours(h, m, 0, 0);
    return isAfter(date, now);
  }


  // Optimistic pick handler
  async function handlePick(choice: 'traditional'|'alternative', meta: { side: 'left'|'right' }) {
    const day = days[step];
    if (!day) return;
    setVotes(vs => {
      const rest = vs.filter(v => v.date !== day.date);
      return [...rest, { date: day.date, choice, side: meta.side }];
    });
    // Telemetry: log pick
    logTelemetry({
      type: 'pick',
      date: day.date,
      shift,
      side: meta.side,
      choice,
      week: weekOf,
      timestamp: Date.now(),
    });
    // Prefetch next image
    if (pairs[step+1]) {
      [pairs[step+1].left, pairs[step+1].right].forEach(opt => {
        if (opt.imageUrl) {
          const img = new window.Image();
          img.src = opt.imageUrl;
        }
      });
    }
    // Go to next day after short delay
    setTimeout(() => {
      if (step < days.length - 1) setStep(step + 1);
    }, 350);
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
  const pair = pairs[step];
  const selected = votes.find(v => v.date === day?.date)?.choice;
  const voteOpen = day ? isVoteOpen(day.date) : false;

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
      {/* Main cards: DuelPicker */}
      {pair && (
        <DuelPicker
          pair={pair}
          onPick={voteOpen ? handlePick : () => {}}
          prevChoice={selected}
          disabled={!voteOpen}
        />
      )}
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
          disabled={submitting || votes.length < days.length}
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
