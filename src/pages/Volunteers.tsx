import { useState } from "react";
import { useNavigate } from "react-router";
import { ExpiryChip } from "../components/badges";
import { DataTable, type TableColumn } from "../components/DataTable";
import { VolunteerDetailModal } from "../components/modals/VolunteerDetailModal";
import { formatYmdToDmy } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { Volunteer } from "../lib/types";

// Name, role, patch, the email Draft email would use, and safeguarding.
const volunteerColumns: TableColumn<Volunteer>[] = [
  {
    key: "name",
    header: "Name",
    render: (volunteer) => volunteer.name,
    sortValue: (volunteer) => volunteer.name,
  },
  {
    key: "role",
    header: "Role",
    render: (volunteer) => volunteer.role,
    sortValue: (volunteer) => volunteer.role,
  },
  {
    key: "locality",
    header: "Locality",
    render: (volunteer) => volunteer.locality,
    sortValue: (volunteer) => volunteer.locality,
  },
  {
    key: "email",
    header: "Email",
    render: (volunteer) => volunteer.email,
    sortValue: (volunteer) => volunteer.email || null,
  },
  {
    key: "dbsExpiry",
    header: "DBS Expiry",
    render: (volunteer) =>
      volunteer.dbsExpiry ? <ExpiryChip date={volunteer.dbsExpiry} /> : "No DBS",
    text: (volunteer) =>
      volunteer.dbsExpiry ? formatYmdToDmy(volunteer.dbsExpiry) : "No DBS",
    sortValue: (volunteer) => volunteer.dbsExpiry || null,
  },
];

export default function Volunteers() {
  const navigate = useNavigate();
  const { volunteers } = useDemoData();
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) =>
    navigate(`/coordinator/volunteers/edit/${encodeURIComponent(id)}`);

  return (
    <>
      <DataTable
        title="Volunteers"
        searchPlaceholder="Search volunteers..."
        data={volunteers}
        columns={volunteerColumns}
        defaultSortKey="name"
        onViewItem={setSelectedVolunteerId}
        onEdit={handleEdit}
        onCreate={() => navigate("/coordinator/volunteers/create")}
      />
      {selectedVolunteerId && (
        <VolunteerDetailModal
          volunteerId={selectedVolunteerId}
          isOpen={Boolean(selectedVolunteerId)}
          onClose={() => setSelectedVolunteerId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}
