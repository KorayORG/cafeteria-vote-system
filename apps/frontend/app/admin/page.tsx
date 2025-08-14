'use client'
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminUsers from './AdminUsers';
import AdminShifts from './AdminShifts';
import AdminTheme from './AdminTheme';
import { fetchMe } from '../../src/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const router = useRouter();
  useEffect(() => {
    fetchMe().then(m => {
      if (!m.ok || m.user?.role !== 'Admin') router.replace('/login?reason=unauthorized');
    });
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Yönetici Paneli</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="shifts">Vardiyalar</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="adjustments">Harici Adetler</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="themes">Temalar</TabsTrigger>
          <TabsTrigger value="audit">Kayıtlar</TabsTrigger>
        </TabsList>
        <TabsContent value="users"><AdminUsers /></TabsContent>
        <TabsContent value="shifts"><AdminShifts /></TabsContent>
        <TabsContent value="categories">Kategori yönetimi yakında.</TabsContent>
        <TabsContent value="adjustments">Harici adet yönetimi yakında.</TabsContent>
        <TabsContent value="settings">Sistem ayarları yakında.</TabsContent>
        <TabsContent value="themes"><AdminTheme /></TabsContent>
        <TabsContent value="audit">İşlem kayıtları yakında.</TabsContent>
      </Tabs>
    </div>
  );
}
