'use client'
import React, { useState } from 'react';
import KitchenStats from '@/components/KitchenStats';
import KitchenMenuManager from '@/components/KitchenMenuManager';
import KitchenInbox from '@/components/KitchenInbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function KitchenPage() {
  const [week, setWeek] = useState<string>(''); // ISO week, e.g. 2025-W33

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mutfak Paneli</h1>
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          <TabsTrigger value="menu">Menü Yönetimi</TabsTrigger>
          <TabsTrigger value="inbox">Öneri Kutusu</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <KitchenStats week={week} setWeek={setWeek} />
        </TabsContent>
        <TabsContent value="menu">
          <KitchenMenuManager week={week} />
        </TabsContent>
        <TabsContent value="inbox">
          <KitchenInbox />
        </TabsContent>
      </Tabs>
    </div>
  );
}
