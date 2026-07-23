import { ExpiryChip } from "./badges";
import { DataTable, type TableColumn } from "./DataTable";
import { formatYmdToDmy } from "../lib/dates";
import type { TrainingRecord } from "../lib/types";

// Read-only version of Paddock's TrainingRecordsTable
// (components/tables/TrainingRecordsTable.tsx) over the demo's simpler
// record shape.
type TrainingRecordRow = TrainingRecord & { id: string };

const trainingRecordColumns: TableColumn<TrainingRecordRow>[] = [
  {
    key: "recordName",
    header: "Training Record",
    render: (item) => item.name,
    sortValue: (item) => item.name,
  },
  {
    key: "completed",
    header: "Completed",
    render: (item) => formatYmdToDmy(item.completed || ""),
    sortValue: (item) => item.completed || null,
  },
  {
    key: "date",
    header: "Expiry Date",
    render: (item) =>
      item.expiry ? <ExpiryChip date={item.expiry} /> : "",
    text: (item) => formatYmdToDmy(item.expiry || ""),
    sortValue: (item) => item.expiry || null,
  },
];

export function TrainingRecordsTable({ data }: { data: TrainingRecord[] }) {
  const rows = data.map((record, index) => ({
    ...record,
    id: `${record.name}-${index}`,
  }));

  return (
    <DataTable
      data={rows}
      columns={trainingRecordColumns}
      title=""
      searchPlaceholder="Search training records..."
      defaultSortKey="date"
    />
  );
}
