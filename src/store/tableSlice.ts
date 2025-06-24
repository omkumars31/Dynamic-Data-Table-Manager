import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form'; //  Needed for compatibility with react-hook-form

//  Table row structure
export type TableRow = {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: string | number;
} & FieldValues;

//  Redux state interface
interface TableState {
  rows: TableRow[];
  visibleColumns: string[];
  allColumns: string[];
}

//  Initial state
const initialState: TableState = {
  rows: [],
  visibleColumns: ['name', 'email', 'age', 'role'],
  allColumns: ['name', 'email', 'age', 'role'],
};

//  Slice
const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<TableRow[]>) => {
      state.rows = action.payload;
    },

    addRow: (state, action: PayloadAction<TableRow>) => {
      state.rows.push(action.payload);
    },

    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },

    deleteRow: (state, action: PayloadAction<number>) => {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },

    addColumn: (state, action: PayloadAction<string>) => {
      const col = action.payload;
      if (!state.allColumns.includes(col)) {
        state.allColumns.push(col);
        state.visibleColumns.push(col);
      }
    },

    //  Already correct for drag-reordering columns
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
    },
  },
});

//  Export actions and reducer
export const {
  setRows,
  addRow,
  updateRow,
  deleteRow,
  addColumn,
  setVisibleColumns,
} = tableSlice.actions;

export default tableSlice.reducer;
