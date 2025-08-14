// /vote page: shift selection, stepper, vote submit, Turkish UI
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VoteStepper from '@/components/VoteStepper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSound } from '@/lib/useSound';

const SHIFTS = [
  { code: 'D', label: 'Gündüz', time: '08:00-16:00', color: 'badge-green' },
  { code: 'E', label: 'Akşam', time: '16:00-00:00', color: 'badge-orange' },
  { code: 'N', label: 'Gece', time: '00:00-08:00', color: 'badge' },
];

export default function VotePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [shift, setShift] = useState<string | null>(params.get('shift'));
  const [audioEnabled, setAudioEnabled] = useState(true);
  const playSuccess = useSound('/sounds/success.mp3', audioEnabled);
  const playError = useSound('/sounds/error.mp3', audioEnabled);

  useEffect(() => {
    if (params.get('shift')) setShift(params.get('shift'));
  }, [params]);

  if (!shift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-2xl font-bold mb-2">Vardiya Seçimi</h1>
        <div className="flex gap-4">
          {SHIFTS.map(s => (
            <Card key={s.code} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => {
              setShift(s.code);
              router.replace(`/vote?shift=${s.code}`);
            }}>
              <CardContent className="flex flex-col items-center p-6">
                <span className={`badge ${s.color} mb-2`}>{s.label}</span>
                <span className="text-lg font-semibold">{s.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <VoteStepper
      shift={shift}
      onSuccess={() => {
  toast({ title: 'Oyunuz kaydedildi!', description: 'Teşekkürler.', variant: 'default', duration: 2000 });
        playSuccess();
        router.push('/');
      }}
      onError={() => {
  toast({ title: 'Hata', description: 'Oy kaydedilemedi.', variant: 'destructive', duration: 2000 });
        playError();
      }}
      audioEnabled={audioEnabled}
      setAudioEnabled={setAudioEnabled}
    />
  );
}
