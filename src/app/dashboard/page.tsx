'use client';

import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import DataTable from '@/components/DataTable';
import { useAppDispatch } from '@/store';
import { setRows } from '@/store/tableSlice';
import ManageColumnsModal from '@/components/ManageColumnsModal';
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + (i % 30),
  role: ['Admin', 'User', 'Manager'][i % 3],
}));

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRows(mockData));
  }, [dispatch]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Data Table Manager
      </Typography>
      <DataTable />
    </Container>
  );
}
