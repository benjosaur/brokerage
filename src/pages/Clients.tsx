import { ServiceBadgeList } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { Client } from "../lib/types";

function deprivationFlags(client: Client): string {
  if (client.deprivation?.income && client.deprivation?.health) return "Both";
  if (client.deprivation?.income) return "Income";
  if (client.deprivation?.health) return "Health";
  return "None";
}

// Paddock's client columns (routes/ClientsRoutes.tsx), plus the WCN
// services pills as a trailing column.
const clientColumns: TableColumn<Client>[] = [
  {
    key: "customId",
    header: "Custom ID",
    render: (client) => client.customId || "",
    sortValue: (client) => client.customId || null,
  },
  {
    key: "name",
    header: "Name",
    render: (client) => client.name,
    sortValue: (client) => client.name,
  },
  {
    key: "dob",
    header: "Date of Birth",
    render: (client) => formatYmdToDmy(client.dateOfBirth || ""),
    sortValue: (client) => client.dateOfBirth || null,
  },
  {
    key: "startDate",
    header: "Agreement Date",
    render: (client) => formatYmdToDmy(client.onboarded.slice(0, 10)),
    sortValue: (client) => client.onboarded || null,
  },
  {
    key: "locality",
    header: "Locality",
    render: (client) => client.locality,
    sortValue: (client) => client.locality,
  },
  {
    key: "postCode",
    header: "Post Code",
    render: (client) => client.postCode || "",
    sortValue: (client) => client.postCode || null,
  },
  {
    key: "attendanceAllowance",
    header: "AA Status",
    render: (client) => client.attendanceAllowance ?? "None",
    sortValue: (client) => client.attendanceAllowance ?? "None",
  },
  {
    key: "deprivationFlags",
    header: "Deprivation Flags",
    render: deprivationFlags,
    sortValue: deprivationFlags,
  },
  {
    key: "services",
    header: "Services",
    render: (client) => <ServiceBadgeList services={client.services} />,
    text: (client) => client.services.join(", "),
    sortValue: (client) => client.services.join(", "),
  },
];

export default function Clients() {
  const { clients } = useDemoData();

  return (
    <DataTable
      title="Clients"
      searchPlaceholder="Search clients..."
      data={clients}
      columns={clientColumns}
      defaultSortKey="name"
    />
  );
}
