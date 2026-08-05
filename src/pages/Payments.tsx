import { feePaidColumn } from "../components/columns";
import { DataTable, type TableColumn } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { pageTitle, totalPill } from "../components/tableStyles";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { Client, MicroProvider } from "../lib/types";

// Same shape as the DBS and Public Liability pages: one field pulled out of
// two entity tables so the coordinator can work the whole chase list in one
// place. Tabs are Clients | MPs because volunteers pay nothing.
const clientColumns: TableColumn<Client>[] = [
  {
    key: "name",
    header: "Name",
    render: (client) => client.name,
    sortValue: (client) => client.name,
  },
  {
    key: "locality",
    header: "Locality",
    render: (client) => client.locality,
    sortValue: (client) => client.locality,
  },
  {
    key: "onboarded",
    header: "Agreement Date",
    render: (client) => formatYmdToDmy(client.onboarded.slice(0, 10)),
    sortValue: (client) => client.onboarded || null,
  },
  feePaidColumn,
];

const providerColumns: TableColumn<MicroProvider>[] = [
  {
    key: "name",
    header: "Name",
    render: (provider) => provider.name,
    sortValue: (provider) => provider.name,
  },
  {
    key: "locality",
    header: "Locality",
    render: (provider) => provider.locality,
    sortValue: (provider) => provider.locality,
  },
  {
    key: "startDate",
    header: "Start Date",
    render: (provider) => formatYmdToDmy(provider.startDate || ""),
    sortValue: (provider) => provider.startDate || null,
  },
  feePaidColumn,
];

export default function Payments() {
  const { clients, providers } = useDemoData();

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className={pageTitle}>Payment Records</h1>
        <span className={totalPill}>
          Total: {clients.length + providers.length}
        </span>
      </div>

      <Tabs
        tabs={[
          {
            label: "Clients",
            content: (
              <DataTable
                title="Clients"
                searchPlaceholder="Search clients..."
                data={clients}
                columns={clientColumns}
                // Descending puts "unpaid" above every date: whoever needs
                // chasing sits at the top, like the expiry pages.
                defaultSortKey="feePaymentDate"
                defaultSortDirection="desc"
              />
            ),
          },
          {
            label: "MPs",
            content: (
              <DataTable
                title="MPs"
                searchPlaceholder="Search MPs..."
                data={providers}
                columns={providerColumns}
                defaultSortKey="feePaymentDate"
                defaultSortDirection="desc"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
