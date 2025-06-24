'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Stack,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setVisibleColumns,
  addColumn,
} from '@/store/tableSlice';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ManageColumnsModal({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const { allColumns, visibleColumns } = useSelector(
    (state: RootState) => state.table
  );

  const [selected, setSelected] = useState<string[]>(visibleColumns);
  const [newColumn, setNewColumn] = useState('');

  const handleToggle = (column: string) => {
    if (selected.includes(column)) {
      setSelected(selected.filter((col) => col !== column));
    } else {
      setSelected([...selected, column]);
    }
  };

  const handleAddColumn = () => {
    const clean = newColumn.trim().toLowerCase();
    if (clean && !allColumns.includes(clean)) {
      dispatch(addColumn(clean));
      setSelected([...selected, clean]);
      setNewColumn('');
    }
  };

  const handleSave = () => {
    dispatch(setVisibleColumns(selected));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {allColumns.map((col) => (
            <FormControlLabel
              key={col}
              control={
                <Checkbox
                  checked={selected.includes(col)}
                  onChange={() => handleToggle(col)}
                />
              }
              label={col.toUpperCase()}
            />
          ))}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <TextField
              size="small"
              label="Add New Column"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              fullWidth
            />
            <Button onClick={handleAddColumn}>Add</Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
