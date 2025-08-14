'use client'
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type User = { _id:string; identityNumber:string; fullName:string; phone:string; role:'Üye'|'Mutfak'|'Admin'; isActive:boolean; activeFrom?:string; activeTo?:string };

export default function AdminUsers() {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const load = async () => {
    setLoading(true);
    const res = await api('/admin/users');
    const j = await res.json();
    setRows(j || []);
    setLoading(false);
  };
  useEffect(()=>{ load(); }, []);

  const setRole = async (id: string, role: User['role']) => {
    await api(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } } as any);
    load();
  };
  const setActiveRange = async (id: string, activeFrom?: string, activeTo?: string, isActive?: boolean) => {
    await api(`/admin/users/${id}/active-range`, { method: 'PATCH', body: { activeFrom, activeTo, isActive } } as any);
    load();
  };

  // Cooldown for manual add
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const filtered = rows.filter(u =>
    u.identityNumber.includes(search) ||
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  if (loading) return <div>Yükleniyor…</div>;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Ara: ad, kimlik, telefon" value={search} onChange={e=>setSearch(e.target.value)} className="max-w-xs" />
          <Button disabled={cooldown>0} onClick={()=>setCooldown(3)}>{cooldown>0 ? `Bekleyin... (${cooldown})` : 'Kullanıcı Ekle'}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left">
              <th className="p-2">Kimlik</th>
              <th className="p-2">Ad Soyad</th>
              <th className="p-2">Telefon</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Aktif</th>
              <th className="p-2">İşlemler</th>
            </tr></thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.identityNumber}</td>
                  <td className="p-2">{u.fullName}</td>
                  <td className="p-2">{u.phone}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={e=>setRole(u._id, e.target.value as any)} className="px-2 py-1 border rounded">
                      <option>Üye</option>
                      <option>Mutfak</option>
                      <option>Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input type="checkbox" checked={u.isActive} onChange={e=>setActiveRange(u._id, undefined, undefined, e.target.checked)} />
                  </td>
                  <td className="p-2">
                    <Button variant="outline" size="sm" onClick={()=>setActiveRange(u._id, new Date().toISOString(), undefined, true)}>Aktif Et (bugün)</Button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={6} className="p-3 text-center text-gray-500">Kayıt yok</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
