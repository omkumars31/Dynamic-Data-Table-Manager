'use client';

import React, { ChangeEvent } from 'react';
import { Button, Stack } from '@mui/material';
import Papa from 'papaparse';

import { useDispatch, useSelector } from 'react-redux';
import { setRows } from '@/store/tableSlice';
import { RootState } from '@/store';
//import {saveAs} from 'file-saver';
import {saveAs} from 'file-saver';




export default function ImportExportControls() {
  const dispatch = useDispatch();
  const { visibleColumns, rows } = useSelector((state: RootState) => state.table);

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data as any[];

        // Validate columns
        const firstRow = parsed[0];
        const keys = Object.keys(firstRow || {});
        const missing = visibleColumns.filter((col) => !keys.includes(col));
        if (missing.length) {
          alert(`Missing columns: ${missing.join(', ')}`);
          return;
        }

        // Add ID if not present
        const rowsWithIds = parsed.map((row, i) => ({
          id: i + 1,
          ...row,
        }));

        dispatch(setRows(rowsWithIds));
        e.target.value = ''; // reset input
      },
      error: (err) => {
        alert('Failed to parse CSV: ' + err.message);
      },
    });
  };

  const handleExport = () => {
    const exportData = rows.map((row) => {
      const filtered: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        filtered[col] = row[col];
      });
      return filtered;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table_export.csv');
  };

  return (
    <Stack direction="row" spacing={2} sx={{ my: 2 }}>
      <Button variant="contained" component="label">
        Import CSV
        <input type="file" accept=".csv" hidden onChange={handleImport} />
      </Button>

      <Button variant="outlined" onClick={handleExport}>
        Export CSV
      </Button>
    </Stack>
  );
}
