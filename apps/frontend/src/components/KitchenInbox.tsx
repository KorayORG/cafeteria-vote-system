'use client'
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Sug = { _id: string; text: string; isRead: boolean; maskedIdentity?: string; createdAt?: string };

export default function KitchenInbox() {
  const [unread, setUnread] = useState<Sug[]>([]);
  const [read, setRead] = useState<Sug[]>([]);
  const [open, setOpen] = useState<Sug | null>(null);
  const [filter, setFilter] = useState<'all'|'unread'>('unread');
  const [search, setSearch] = useState('');

  const load = async () => {
    const r1 = await api('/suggestions?isRead=false'); const u = await r1.json();
    const r2 = await api('/suggestions?isRead=true');  const r = await r2.json();
    setUnread(u || []); setRead(r || []);
  };

  useEffect(() => { load(); }, []);

  const markSeen = async (id: string) => {
    await api(`/suggestions/${id}/seen`, { method: 'POST' } as any);
    setOpen(null);
    load();
  };

  const filteredUnread = unread.filter(m => m.text.toLowerCase().includes(search.toLowerCase()));
  const filteredRead = read.filter(m => m.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        <Button variant={filter==='unread'?'default':'outline'} onClick={()=>setFilter('unread')}>
          Okunmamış <Badge color="orange" className="ml-2">{unread.length}</Badge>
        </Button>
        <Button variant={filter==='all'?'default':'outline'} onClick={()=>setFilter('all')}>
          Tümü <Badge color="gray" className="ml-2">{unread.length+read.length}</Badge>
        </Button>
        <input
          className="ml-auto border rounded px-2 py-1 text-sm"
          placeholder="Ara..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(filter==='unread'?filteredUnread:filteredUnread.concat(filteredRead)).map(m => (
          <Card key={m._id} className={`cursor-pointer ${!m.isRead ? 'border-orange-400' : ''}`} onClick={()=>setOpen(m)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium line-clamp-1">{m.text.slice(0, 60)}</span>
                {!m.isRead && <Badge color="orange">Yeni</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {m.maskedIdentity && <span>{m.maskedIdentity}</span>}
                <span>{new Date(m.createdAt || '').toLocaleString('tr-TR')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {(filter==='unread'?filteredUnread:filteredUnread.concat(filteredRead)).length===0 && (
          <div className="text-gray-500 text-sm col-span-2">Kayıt yok.</div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50" onClick={()=>setOpen(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
            <h4 className="text-lg font-semibold mb-2">Öneri</h4>
            <p className="mb-4 whitespace-pre-wrap">{open.text}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              {open.maskedIdentity && <span>{open.maskedIdentity}</span>}
              <span>{new Date(open.createdAt || '').toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={()=>setOpen(null)}>Kapat</Button>
              {!open.isRead && <Button onClick={()=>markSeen(open._id)}>Görüldü olarak işaretle</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
