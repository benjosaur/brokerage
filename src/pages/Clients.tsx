import { useState } from "react";
import { useNavigate } from "react-router";
import { ServiceBadgeList } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { ClientDetailModal } from "../components/modals/ClientDetailModal";
import { formatYmdToDmy } from "../lib/dates";
import { fundingShort } from "../lib/format";
import { useDemoData } from "../lib/store";
import type { Client } from "../lib/types";

// The columns the questionnaire actually feeds: agreement date is the
// form submission date and funding is its "how will your care be funded?"
// answer.
const clientColumns: TableColumn<Client>[] = [
  {
    key: "name",
    header: "Name",
    render: (client) => client.name,
    sortValue: (client) => client.name,
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
    key: "funding",
    header: "Funding",
    render: (client) => fundingShort(client.funding),
    sortValue: (client) => fundingShort(client.funding) || null,
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
  const navigate = useNavigate();
  const { clients } = useDemoData();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleEdit = (id: string) =>
    navigate(`/coordinator/clients/edit/${encodeURIComponent(id)}`);

  return (
    <>
      <DataTable
        title="Clients"
        searchPlaceholder="Search clients..."
        data={clients}
        columns={clientColumns}
        defaultSortKey="name"
        onViewItem={setSelectedClientId}
        onEdit={handleEdit}
        onCreate={() => navigate("/coordinator/clients/create")}
      />
      {selectedClientId && (
        <ClientDetailModal
          clientId={selectedClientId}
          isOpen={Boolean(selectedClientId)}
          onClose={() => setSelectedClientId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}
