'use client'
type Dish = { name: string; imageUrl?: string; categories?: string[] }

export function DishChoice({
  left, right, value, onChange
}: {
  left: Dish; right: Dish;
  value?: 'Traditional'|'Alternative';
  onChange: (v: 'Traditional'|'Alternative') => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={()=>onChange('Traditional')}
        className={`relative card ${value==='Traditional' ? 'ring-2 ring-[--brand-orange]' : ''}`}
        style={{['--brand-orange' as any]:'#ff7a00'}}
      >
        <img src={left.imageUrl || '/no-image.png'} alt={left.name} className="w-full h-40 object-cover rounded-lg" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium">
          {left.name}
        </div>
        <span className="absolute top-2 right-2 text-xs bg-[--brand-orange] text-white px-2 py-1 rounded-full">Geleneksel</span>
      </button>

      <button
        type="button"
        onClick={()=>onChange('Alternative')}
        className={`relative card ${value==='Alternative' ? 'ring-2 ring-[--brand-green]' : ''}`}
        style={{['--brand-green' as any]:'#157347'}}
      >
        <img src={right.imageUrl || '/no-image.png'} alt={right.name} className="w-full h-40 object-cover rounded-lg" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium">
          {right.name}
        </div>
        <span className="absolute top-2 left-2 text-xs bg-[--brand-green] text-white px-2 py-1 rounded-full">Alternatif</span>
      </button>
    </div>
  )
}
