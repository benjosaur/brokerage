import { useState } from "react";
import { useNavigate } from "react-router";
import { ExpiryChip, ServiceBadgeList } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { ProviderDetailModal } from "../components/modals/ProviderDetailModal";
import { formatYmdToDmy } from "../lib/dates";
import { areasCoveredText } from "../lib/format";
import { useDemoData } from "../lib/store";
import type { MicroProvider } from "../lib/types";

// The columns matching and vetting actually run on: areas covered drives
// the locality filter, email is where the Email button goes, and the two
// expiries are the accreditation promise.
const providerColumns: TableColumn<MicroProvider>[] = [
  {
    key: "name",
    header: "Name",
    render: (provider) => provider.name,
    sortValue: (provider) => provider.name,
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
    key: "areasCovered",
    header: "Areas Covered",
    render: (provider) => areasCoveredText(provider.areasCovered),
    sortValue: (provider) => areasCoveredText(provider.areasCovered) || null,
  },
  {
    key: "services",
    header: "Services",
    render: (provider) => <ServiceBadgeList services={provider.services} />,
    text: (provider) => provider.services.join(", "),
    sortValue: (provider) => provider.services.join(", "),
  },
  {
    key: "availability",
    header: "Availability",
    render: (provider) => provider.availability,
    sortValue: (provider) => provider.availability || null,
  },
  {
    key: "email",
    header: "Email",
    render: (provider) => provider.email,
    sortValue: (provider) => provider.email || null,
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
    key: "publicLiabilityExpiry",
    header: "Public Liability Expiry",
    render: (provider) =>
      provider.publicLiabilityExpiry ? (
        <ExpiryChip date={provider.publicLiabilityExpiry} />
      ) : (
        "No Public Liability"
      ),
    text: (provider) =>
      provider.publicLiabilityExpiry
        ? formatYmdToDmy(provider.publicLiabilityExpiry)
        : "No Public Liability",
    sortValue: (provider) => provider.publicLiabilityExpiry || null,
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
