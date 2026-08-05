import { feePaidColumn } from "../components/columns";
import { DataTable, type TableColumn } from "../components/DataTable";
import { Tabs } from "../components/Tabs";
import { pageTitle, totalPill } from "../components/tableStyles";
import { useDemoData } from "../lib/store";
import type { Client, MicroProvider } from "../lib/types";

// Same shape as the DBS and Public Liability pages: one field pulled out of
// two entity tables so the coordinator can work the whole chase list in one
// place. Tabs are Clients | MPs because volunteers pay nothing. Who and
// whether they have paid is the whole job here; everything else about them
// lives one click away on their own page.
const paymentColumns: TableColumn<Client | MicroProvider>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => item.name,
    sortValue: (item) => item.name,
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
                columns={paymentColumns}
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
                columns={paymentColumns}
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
