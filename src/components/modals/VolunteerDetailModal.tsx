import { Button } from "../Button";
import { Dialog, DialogFooter, DialogTitle } from "../Dialog";
import { Tabs } from "../Tabs";
import { TrainingRecordsTable } from "../TrainingRecordsTable";
import { formatYmdToDmy } from "../../lib/dates";
import { useDemoData } from "../../lib/store";
import { DetailItem } from "./DetailItem";
import { tabPanel } from "./tabPanel";

// Port of Paddock's VolunteerDetailModal minus the packages/notes/
// attachments tabs the demo has no data for.
export function VolunteerDetailModal({
  volunteerId,
  isOpen,
  onClose,
  onEdit,
}: {
  volunteerId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
}) {
  const { volunteers } = useDemoData();
  const volunteer = volunteers.find((entry) => entry.id === volunteerId);
  if (!volunteer) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="flex h-[80vh] w-[80vw] flex-col gap-4"
    >
      <DialogTitle>Volunteer Details: {volunteer.name}</DialogTitle>
      <div className="flex-grow overflow-y-auto pr-2">
        <Tabs
          contentClassName="mt-4"
          tabs={[
            {
              label: "General Info",
              content: (
                <div className={tabPanel}>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    General Information
                  </h3>
                  <DetailItem label="ID" value={volunteer.id} />
                  <DetailItem label="Name" value={volunteer.name} />
                  <DetailItem label="Role" value={volunteer.role} />
                  <DetailItem label="Locality" value={volunteer.locality} />
                  <DetailItem label="Post Code" value={volunteer.postCode} />
                  <DetailItem label="Phone" value={volunteer.phone} />
                  <DetailItem label="Email" value={volunteer.email} />
                  <DetailItem
                    label="Volunteering Since"
                    value={formatYmdToDmy(volunteer.since)}
                  />
                  <DetailItem
                    label="Date of Birth"
                    value={formatYmdToDmy(volunteer.dateOfBirth)}
                  />
                  <DetailItem label="DBS Number" value={volunteer.dbsNumber} />
                  <DetailItem
                    label="DBS Expiry"
                    value={formatYmdToDmy(volunteer.dbsExpiry)}
                  />
                  <DetailItem
                    label="Public Liability Number"
                    value={volunteer.publicLiabilityNumber}
                  />
                  <DetailItem
                    label="Public Liability Expiry"
                    value={formatYmdToDmy(volunteer.publicLiabilityExpiry)}
                  />
                </div>
              ),
            },
            {
              label: "Training Records",
              content: (
                <div className={tabPanel}>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Training Records
                  </h3>
                  {volunteer.training.length > 0 ? (
                    <TrainingRecordsTable data={volunteer.training} />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No training records found for this volunteer.
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
      <DialogFooter>
        {onEdit && <Button onClick={() => onEdit(volunteer.id)}>Edit</Button>}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
