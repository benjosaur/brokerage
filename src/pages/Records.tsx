import { ExpiryChip } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { pageTitle, totalPill } from "../components/tableStyles";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import { coreCompletion, type CoreCompletion } from "../lib/training";
import type { TrainingRecord } from "../lib/types";

// Port of Paddock's Records page (routes/RecordsRoutes.tsx): a per-carer
// summary of core training completion.
type CoreCompletionRow = CoreCompletion & { id: string; name: string };

const aggregateColumns: TableColumn<CoreCompletionRow>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => item.name,
    sortValue: (item) => item.name,
  },
  {
    key: "earliest",
    header: "Earliest Expiry",
    render: (item) =>
      item.earliestCoreExpiryDate ? (
        <ExpiryChip date={item.earliestCoreExpiryDate} />
      ) : (
        ""
      ),
    text: (item) => formatYmdToDmy(item.earliestCoreExpiryDate || ""),
    sortValue: (item) => item.earliestCoreExpiryDate || null,
  },
  {
    key: "rate",
    header: "Core Completion Rate",
    render: (item) => `${Math.round(item.coreCompletionRate)}%`,
    sortValue: (item) => item.coreCompletionRate,
  },
];

function toRows(
  people: { id: string; name: string; training: TrainingRecord[] }[],
): CoreCompletionRow[] {
  return people.map((person) => ({
    id: person.id,
    name: person.name,
    ...coreCompletion(person.training),
  }));
}

export default function Records() {
  const { providers, volunteers } = useDemoData();

  const providerRows = toRows(providers);
  const volunteerRows = toRows(volunteers);

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className={pageTitle}>Training Records</h1>
        <span className={totalPill}>
          Total: {providerRows.length + volunteerRows.length}
        </span>
      </div>

      <Tabs
        tabs={[
          {
            label: "MPs",
            content: (
              <DataTable
                title="MPs"
                searchPlaceholder="Search MPs..."
                data={providerRows}
                columns={aggregateColumns}
                defaultSortKey="earliest"
              />
            ),
          },
          {
            label: "Volunteers",
            content: (
              <DataTable
                title="Volunteers"
                searchPlaceholder="Search volunteers..."
                data={volunteerRows}
                columns={aggregateColumns}
                defaultSortKey="earliest"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
