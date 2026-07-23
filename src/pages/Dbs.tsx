import { ExpiryChip } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { pageTitle, totalPill } from "../components/tableStyles";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { MicroProvider, Volunteer } from "../lib/types";

// Port of Paddock's DBS page (routes/DbsRoutes.tsx): one column set shared
// by the MPs and Volunteers tabs.
const dbsColumns: TableColumn<MicroProvider | Volunteer>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => item.name,
    sortValue: (item) => item.name,
  },
  {
    key: "dbsNumber",
    header: "DBS Number",
    render: (item) => item.dbsNumber || "",
    sortValue: (item) => item.dbsNumber || null,
  },
  {
    key: "dbsExpiry",
    header: "DBS Expiry",
    render: (item) =>
      item.dbsExpiry ? <ExpiryChip date={item.dbsExpiry} /> : "No DBS",
    text: (item) =>
      item.dbsExpiry ? formatYmdToDmy(item.dbsExpiry) : "No DBS",
    sortValue: (item) => item.dbsExpiry || null,
  },
];

export default function Dbs() {
  const { providers, volunteers } = useDemoData();

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className={pageTitle}>DBS Records</h1>
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
                columns={dbsColumns}
                defaultSortKey="dbsExpiry"
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
                columns={dbsColumns}
                defaultSortKey="dbsExpiry"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
