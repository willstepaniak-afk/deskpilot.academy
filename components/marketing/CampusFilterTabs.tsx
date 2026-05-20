'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampusGrid } from './CampusGrid';
import type { Campus } from '@/lib/campuses';

export function CampusFilterTabs({ campuses }: { campuses: Campus[] }) {
  const live = campuses.filter((c) => c.status === 'live');
  const upcoming = campuses.filter((c) => c.status === 'coming_soon');
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All ({campuses.length})</TabsTrigger>
        <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
        <TabsTrigger value="upcoming">Coming Soon ({upcoming.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <CampusGrid campuses={campuses} />
      </TabsContent>
      <TabsContent value="live">
        <CampusGrid campuses={live} />
      </TabsContent>
      <TabsContent value="upcoming">
        <CampusGrid campuses={upcoming} />
      </TabsContent>
    </Tabs>
  );
}
