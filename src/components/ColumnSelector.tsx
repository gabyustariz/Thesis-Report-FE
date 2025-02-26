import { MultiSelect } from "./MultiSelect";

interface ColumnSelectorProps {
  columns: string[];
  visibleColumns: string[];
  onColumnChange: (columns: string[]) => void;
}

export default function ColumnSelector({
  columns,
  visibleColumns,
  onColumnChange,
}: ColumnSelectorProps) {
  return (
    <div className="mb-4">
      <MultiSelect
        options={columns}
        selected={visibleColumns}
        onChange={onColumnChange}
        placeholder="Select visible columns"
      />
    </div>
  );
}
