'use client';

import React from 'react';
import DataTable from '@/components/DataTable';

export default function HomePage() {
  return (
    <main>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Dynamic Data Table Manager</h1>
      <DataTable />
    </main>
  );
}
