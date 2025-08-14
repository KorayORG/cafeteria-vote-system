'use client'
import { motion } from 'framer-motion';
type Dish = { name: string; imageUrl?: string; categories?: string[] };

export function DishChoice({
  left, right, value, onChange
}: {
  left: Dish; right: Dish;
  value?: 'Traditional'|'Alternative';
  onChange: (v: 'Traditional'|'Alternative') => void;
}) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="grid md:grid-cols-2 gap-4">
      {[{dish:left, type:'Traditional', badge:'badge-orange', badgeText:'Geleneksel', pos:'right-2'}, {dish:right, type:'Alternative', badge:'badge-green', badgeText:'Alternatif', pos:'left-2'}].map((opt, i) => (
        <motion.button
          key={opt.type}
          type="button"
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 rgba(251,146,60,0.13)' }}
          whileTap={{ scale: 0.97 }}
          onClick={()=>onChange(opt.type as any)}
          className={`relative card overflow-hidden group transition-all duration-200 ${value===opt.type ? 'ring-2 ring-orange-400/80' : ''}`}
          style={opt.type==='Traditional' ? {['--brand-orange' as any]:'#ff7a00'} : {['--brand-green' as any]:'#157347'}}
        >
          <motion.img
            src={opt.dish.imageUrl || '/no-image.png'}
            alt={opt.dish.name}
            className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            initial={{ scale: 1 }}
            animate={{ scale: value===opt.type ? 1.04 : 1 }}
          />
          {/* Gradient overlay for image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none rounded-lg" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium shadow">
            {opt.dish.name}
          </div>
          <motion.span
            className={`absolute top-2 ${opt.pos} badge ${opt.badge} shadow-lg`}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: value===opt.type ? 1.1 : 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >{opt.badgeText}</motion.span>
          {/* Glow effect on select */}
          {value===opt.type && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              exit={{ opacity: 0 }}
              style={{ boxShadow: `0 0 0 6px ${opt.type==='Traditional' ? '#fb923c' : '#22c55e'}55` }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
