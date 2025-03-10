import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./MultiSelect";
import { metricsKeys } from "@/types";
import { group } from "console";
import { TABLE_MAPPING } from "@/constants";
import ColumnSelector from "./ColumnSelector";

interface ControlPanelProps {
  fields: (keyof typeof TABLE_MAPPING)[];
  metrics: typeof metricsKeys;
  groupBy: string | null;
  onGroupByChange: (value: string | null) => void;
  onAggregationsChange: (value: string[]) => void;
  aggregations: typeof metricsKeys;
  visibleColumns: string[];
  handleColumnChange: (columns: string[]) => void;
}

export default function ControlPanel({
  fields,
  metrics,
  groupBy,
  onGroupByChange,
  onAggregationsChange,
  aggregations,
  visibleColumns,
  handleColumnChange,
}: ControlPanelProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center">
      <div>
        <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Agrupar por
        </label>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="min-w-[180px]">
            <Select
              onValueChange={(value) =>
                onGroupByChange(value === "none" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Agrupar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin agrupación</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {groupBy && (
            <div className="flex-1 min-w-[280px]">
              <MultiSelect
                options={[...metrics]}
                selected={[...aggregations]}
                onChange={onAggregationsChange}
                placeholder="Select aggregations"
              />
            </div>
          )}
        </div>
      </div>
      <MultiSelect
        options={Object.keys(TABLE_MAPPING)}
        selected={visibleColumns}
        onChange={(columns) => handleColumnChange(columns)}
        placeholder="Selecciona las columnas visibles"
      />
    </div>
  );
}
