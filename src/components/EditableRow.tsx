'use client';

import { TableRow as MuiTableRow, TableCell, TextField } from '@mui/material';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { TableRow as RowType, updateRow } from '@/store/tableSlice';
import { useAppDispatch } from '@/store';

interface Props {
  row: RowType;
  visibleColumns: string[];
  onSave: () => void;
  onCancel: () => void;
}

export default function EditableRow({ row, visibleColumns, onSave, onCancel }: Props) {
  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues: row,
  });

  const dispatch = useAppDispatch();

  const onSubmit = (data: FieldValues) => {
    dispatch(updateRow({ ...data, id: row.id } as RowType)); // ✅ Use RowType here
    onSave();
  };

  return (
    <MuiTableRow>
      {visibleColumns.map((col) => (
        <TableCell key={col}>
          <Controller
            name={col}
            control={control}
            rules={{
              required: `${col} is required`,
              ...(col === 'age' && {
                validate: (value) => !isNaN(Number(value)) || 'Age must be a number',
              }),
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </TableCell>
      ))}

      <TableCell>
        <button onClick={handleSubmit(onSubmit)}>✅</button>
        <button onClick={onCancel}>❌</button>
      </TableCell>
    </MuiTableRow>
  );
}
