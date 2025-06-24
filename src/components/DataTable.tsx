'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TextField,
  Paper,
  TableSortLabel,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableHead,
} from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { TableRow as RowType, deleteRow, setVisibleColumns } from '@/store/tableSlice';
import { toggleTheme } from '@/store/themeSlice';
import ManageColumnsModal from './ManageColumnsModal';
import ImportExportControls from './ImportExportControls';
import EditableRow from './EditableRow';

type Order = 'asc' | 'desc';

export default function DataTable() {
  const dispatch = useDispatch();
  const { rows, visibleColumns } = useSelector((state: RootState) => state.table);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<Order>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      visibleColumns.some((col) =>
        String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rows, searchQuery, visibleColumns]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortColumn, sortOrder]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(visibleColumns);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    dispatch(setVisibleColumns(newOrder));
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* Search + Controls */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '70%' }}
        />

        <Stack direction="row" spacing={1}>
          <ImportExportControls />
          <Button variant="outlined" onClick={() => setModalOpen(true)}>
            Manage Columns
          </Button>
          <Button variant="outlined" onClick={() => dispatch(toggleTheme())}>
            Toggle Theme
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <TableContainer>
        <Table>
          {/* 🆕 Drag-n-Drop Column Header */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns" direction="horizontal" type="column">
              {(provided) => (
                <TableHead ref={provided.innerRef} {...provided.droppableProps}>
                  <TableRow>
                    {visibleColumns.map((col, index) => (
                      <Draggable key={col} draggableId={col} index={index}>
                        {(provided) => (
                          <TableCell
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableSortLabel
                              active={sortColumn === col}
                              direction={sortColumn === col ? sortOrder : 'asc'}
                              onClick={() => handleSort(col)}
                            >
                              {col.toUpperCase()}
                            </TableSortLabel>
                          </TableCell>
                        )}
                      </Draggable>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                  {provided.placeholder}
                </TableHead>
              )}
            </Droppable>
          </DragDropContext>

          {/* Table Body */}
          <TableBody>
            {paginatedRows.map((row) =>
              editId === row.id ? (
                <EditableRow
                  key={row.id}
                  row={row}
                  visibleColumns={visibleColumns}
                  onSave={() => setEditId(null)}
                  onCancel={() => setEditId(null)}
                />
              ) : (
                <TableRow key={row.id} onDoubleClick={() => setEditId(row.id)} hover>
                  {visibleColumns.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                  <TableCell>
                    <button onClick={() => setEditId(row.id)}>✏️</button>
                    <button onClick={() => setDeleteId(row.id)}>🗑️</button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />

      {/* Modal */}
      <ManageColumnsModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteId !== null) {
                dispatch(deleteRow(deleteId));
                setDeleteId(null);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
