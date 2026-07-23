import { Button } from "../Button";
import { Dialog, DialogFooter, DialogTitle } from "../Dialog";
import { Tabs } from "../Tabs";
import { TrainingRecordsTable } from "../TrainingRecordsTable";
import { ServiceBadgeList } from "../badges";
import { formatYmdToDmy } from "../../lib/dates";
import { useDemoData } from "../../lib/store";
import { DetailItem } from "./DetailItem";
import { tabPanel } from "./tabPanel";

// Port of Paddock's MpDetailModal minus the packages/notes/attachments
// tabs the demo has no data for.
export function ProviderDetailModal({
  providerId,
  isOpen,
  onClose,
  onEdit,
}: {
  providerId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
}) {
  const { providers } = useDemoData();
  const provider = providers.find((entry) => entry.id === providerId);
  if (!provider) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="flex h-[80vh] w-[80vw] flex-col gap-4"
    >
      <DialogTitle>Micro-provider Details: {provider.name}</DialogTitle>
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
                  <DetailItem label="ID" value={provider.id} />
                  <DetailItem label="Name" value={provider.name} />
                  <DetailItem label="Locality" value={provider.locality} />
                  <DetailItem label="Post Code" value={provider.postCode} />
                  <DetailItem label="Phone" value={provider.phone} />
                  <DetailItem label="Email" value={provider.email} />
                  <DetailItem
                    label="Start Date"
                    value={formatYmdToDmy(provider.startDate)}
                  />
                  <DetailItem
                    label="Date of Birth"
                    value={formatYmdToDmy(provider.dateOfBirth)}
                  />
                  <DetailItem label="DBS Number" value={provider.dbsNumber} />
                  <DetailItem
                    label="DBS Expiry"
                    value={formatYmdToDmy(provider.dbsExpiry)}
                  />
                  <DetailItem
                    label="Public Liability Number"
                    value={provider.publicLiabilityNumber}
                  />
                  <DetailItem
                    label="Public Liability Expiry"
                    value={formatYmdToDmy(provider.publicLiabilityExpiry)}
                  />
                  <DetailItem
                    label="Fee Payment Date"
                    value={
                      provider.feePaymentDate === "unpaid"
                        ? "Unpaid"
                        : formatYmdToDmy(provider.feePaymentDate)
                    }
                  />
                  <DetailItem label="Services">
                    <span className="inline-block align-middle">
                      <ServiceBadgeList services={provider.services} />
                    </span>
                  </DetailItem>
                  <DetailItem
                    label="Availability"
                    value={provider.availability}
                  />
                  <DetailItem label="Bio" value={provider.bio} />
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
                  {provider.training.length > 0 ? (
                    <TrainingRecordsTable data={provider.training} />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No training records found for this micro-provider.
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
      <DialogFooter>
        {onEdit && <Button onClick={() => onEdit(provider.id)}>Edit</Button>}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
