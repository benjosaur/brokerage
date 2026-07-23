import { ExpiryChip } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { pageTitle, totalPill } from "../components/tableStyles";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { MicroProvider, Volunteer } from "../lib/types";

// Port of Paddock's Public Liability page (routes/PublicLiabilityRoutes.tsx).
const publicLiabilityColumns: TableColumn<MicroProvider | Volunteer>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => item.name,
    sortValue: (item) => item.name,
  },
  {
    key: "publicLiabilityNumber",
    header: "Public Liability Number",
    render: (item) => item.publicLiabilityNumber || "No Public Liability",
    sortValue: (item) => item.publicLiabilityNumber || null,
  },
  {
    key: "publicLiabilityExpiry",
    header: "Public Liability Expiry",
    render: (item) =>
      item.publicLiabilityExpiry ? (
        <ExpiryChip date={item.publicLiabilityExpiry} />
      ) : (
        "No Public Liability"
      ),
    text: (item) =>
      item.publicLiabilityExpiry
        ? formatYmdToDmy(item.publicLiabilityExpiry)
        : "No Public Liability",
    sortValue: (item) => item.publicLiabilityExpiry || null,
  },
];

export default function PublicLiability() {
  const { providers, volunteers } = useDemoData();

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className={pageTitle}>Insurance Records</h1>
        <span className={totalPill}>
          Total: {providers.length + volunteers.length}
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
                data={providers}
                columns={publicLiabilityColumns}
                defaultSortKey="publicLiabilityExpiry"
              />
            ),
          },
          {
            label: "Volunteers",
            content: (
              <DataTable
                title="Volunteers"
                searchPlaceholder="Search volunteers..."
                data={volunteers}
                columns={publicLiabilityColumns}
                defaultSortKey="publicLiabilityExpiry"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
