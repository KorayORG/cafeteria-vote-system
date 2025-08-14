// DuelPicker: İkili seçim kartı, randomize, animasyon, a11y, optimistic
'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type Option = {
  id: string;
  label: 'Geleneksel' | 'Alternatif';
  name: string;
  imageUrl?: string;
  tags?: string[];
};

type Props = {
  pair: { left: Option; right: Option };
  onPick: (choice: 'traditional' | 'alternative', meta: { side: 'left' | 'right' }) => Promise<void> | void;
  prevChoice?: 'traditional' | 'alternative';
  disabled?: boolean;
};

export function DuelPicker({ pair, onPick, prevChoice, disabled }: Props) {
  const [locking, setLocking] = useState(false);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Klavye ile seçim
  useEffect(() => {
    if (disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (locking) return;
      if (e.key === 'ArrowLeft') pick('left');
      if (e.key === 'ArrowRight') pick('right');
      if (e.key === 'Enter' && picked) pick(picked);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locking, picked, disabled]);

  const pick = async (side: 'left' | 'right') => {
    if (locking || disabled) return;
    setLocking(true);
    setPicked(side);
    const choice = side === 'left'
      ? (pair.left.label === 'Geleneksel' ? 'traditional' : 'alternative')
      : (pair.right.label === 'Geleneksel' ? 'traditional' : 'alternative');
    try {
      await onPick(choice, { side });
    } catch (e) {
      setPicked(null);
      alert('Oy gönderilemedi, tekrar deneyin.');
    } finally {
      setLocking(false);
    }
  };

  // Önceki seçim varsa kartın outline'ı
  const outlineLeft  = prevChoice && (pair.left.label === 'Geleneksel' ? 'traditional' : 'alternative') === prevChoice;
  const outlineRight = prevChoice && (pair.right.label=== 'Geleneksel' ? 'traditional' : 'alternative') === prevChoice;

  const Card = (side: 'left'|'right', opt: Option) => (
    <button
      type="button"
      onClick={() => pick(side)}
      disabled={locking || disabled}
      className={clsx(
        'group relative w-full rounded-2xl border bg-white/5 p-4 text-left outline-none transition',
        'hover:bg-white/10 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-white/40',
        side==='left' ? 'border-orange-400/30' : 'border-emerald-400/30',
        (side==='left'  && outlineLeft)  && 'ring-2 ring-orange-400/50',
        (side==='right' && outlineRight) && 'ring-2 ring-emerald-400/50',
        locking && picked!==side && 'opacity-40'
      )}
      aria-label={`${opt.label}: ${opt.name}`}
      aria-pressed={picked===side}
    >
      <div className="text-xs text-gray-400 mb-1">{opt.label}</div>
      <div className="text-lg font-semibold">{opt.name}</div>
      {opt.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {opt.tags.map(t => (
            <span
              key={t}
              className={clsx(
                'badge',
                side==='left' ? 'badge-orange' : 'badge-green'
              )}
            >{t}</span>
          ))}
        </div>
      ) : null}
      {opt.imageUrl && (
        <img
          src={opt.imageUrl}
          alt={opt.name}
          className="mt-3 h-36 w-full object-cover rounded-xl"
          draggable={false}
        />
      )}
      {/* seçilince parıltı */}
      <AnimatePresence>
        {picked===side && (
          <motion.div
            initial={{ opacity:0, scale:0.95 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0 }}
            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/60"
          />
        )}
      </AnimatePresence>
    </button>
  );

  return (
    <div ref={containerRef} className="grid gap-4 sm:grid-cols-2">
      {Card('left',  pair.left)}
      {Card('right', pair.right)}
    </div>
  );
}

// Yanları randomize etmek için yardımcı
export function shuffleSides(a: Option, b: Option) {
  const leftFirst = Math.random() < 0.5;
  return leftFirst ? { left: a, right: b } : { left: b, right: a };
}
