import { useState } from "react";
import { useNavigate } from "react-router";
import { ExpiryChip, ServiceBadgeList } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { ProviderDetailModal } from "../components/modals/ProviderDetailModal";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { MicroProvider } from "../lib/types";

// Paddock's MP columns (routes/MpsRoutes.tsx), plus the WCN services pills
// as a trailing column.
const providerColumns: TableColumn<MicroProvider>[] = [
  {
    key: "name",
    header: "Name",
    render: (provider) => provider.name,
    sortValue: (provider) => provider.name,
  },
  {
    key: "dob",
    header: "Date of Birth",
    render: (provider) =>
      provider.dateOfBirth ? formatYmdToDmy(provider.dateOfBirth) : "Unknown",
    sortValue: (provider) => provider.dateOfBirth || null,
  },
  {
    key: "startDate",
    header: "Start Date",
    render: (provider) => formatYmdToDmy(provider.startDate || ""),
    sortValue: (provider) => provider.startDate || null,
  },
  {
    key: "locality",
    header: "Locality",
    render: (provider) => provider.locality,
    sortValue: (provider) => provider.locality,
  },
  {
    key: "postCode",
    header: "Post Code",
    render: (provider) => provider.postCode,
    sortValue: (provider) => provider.postCode,
  },
  {
    key: "dbsExpiry",
    header: "DBS Expiry",
    render: (provider) =>
      provider.dbsExpiry ? <ExpiryChip date={provider.dbsExpiry} /> : "No DBS",
    text: (provider) =>
      provider.dbsExpiry ? formatYmdToDmy(provider.dbsExpiry) : "No DBS",
    sortValue: (provider) => provider.dbsExpiry || null,
  },
  {
    key: "feePaymentDate",
    header: "Fee Date",
    render: (provider) =>
      provider.feePaymentDate === "unpaid" ? "Unpaid" : provider.feePaymentDate,
    sortValue: (provider) => provider.feePaymentDate || null,
  },
  {
    key: "services",
    header: "Services",
    render: (provider) => <ServiceBadgeList services={provider.services} />,
    text: (provider) => provider.services.join(", "),
    sortValue: (provider) => provider.services.join(", "),
  },
];

export default function Providers() {
  const navigate = useNavigate();
  const { providers } = useDemoData();
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) =>
    navigate(`/coordinator/providers/edit/${encodeURIComponent(id)}`);

  return (
    <>
      <DataTable
        title="Micro-providers"
        searchPlaceholder="Search micro-providers..."
        data={providers}
        columns={providerColumns}
        defaultSortKey="name"
        onViewItem={setSelectedProviderId}
        onEdit={handleEdit}
        onCreate={() => navigate("/coordinator/providers/create")}
      />
      {selectedProviderId && (
        <ProviderDetailModal
          providerId={selectedProviderId}
          isOpen={Boolean(selectedProviderId)}
          onClose={() => setSelectedProviderId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}
