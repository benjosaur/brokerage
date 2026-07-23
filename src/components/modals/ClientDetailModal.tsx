import { Button } from "../Button";
import { Dialog, DialogFooter, DialogTitle } from "../Dialog";
import { Tabs } from "../Tabs";
import { ServiceBadgeList } from "../badges";
import { formatYmdToDmy } from "../../lib/dates";
import { deprivationFlags, fundingShort } from "../../lib/format";
import { useDemoData } from "../../lib/store";
import { DetailItem } from "./DetailItem";
import { tabPanel } from "./tabPanel";

// Port of Paddock's ClientDetailModal minus the request/log/notes/
// attachments tabs the demo has no data for.
export function ClientDetailModal({
  clientId,
  isOpen,
  onClose,
  onEdit,
}: {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
}) {
  const { clients, requests } = useDemoData();
  const client = clients.find((entry) => entry.id === clientId);
  if (!client) return null;

  const requestCount = requests.filter(
    (request) => request.clientId === client.id,
  ).length;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="flex h-[80vh] w-[80vw] flex-col gap-4"
    >
      <DialogTitle>Client Details: {client.name}</DialogTitle>
      <div className="flex-grow overflow-y-auto pr-2">
        <Tabs
          contentClassName="mt-4"
          tabs={[
            {
              label: "Contact Info",
              content: (
                <div className={tabPanel}>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Contact Information
                  </h3>
                  <DetailItem label="ID" value={client.id} />
                  <DetailItem label="Custom ID" value={client.customId} />
                  <DetailItem label="Name" value={client.name} />
                  <DetailItem
                    label="Date of Birth"
                    value={formatYmdToDmy(client.dateOfBirth)}
                  />
                  <DetailItem
                    label="Agreement Date"
                    value={formatYmdToDmy(client.onboarded.slice(0, 10))}
                  />
                  <DetailItem label="Locality" value={client.locality} />
                  <DetailItem label="Post Code" value={client.postCode} />
                  <DetailItem label="Status" value={client.status} />
                </div>
              ),
            },
            {
              label: "Services & Needs",
              content: (
                <div className={tabPanel}>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Services & Needs
                  </h3>
                  <DetailItem label="Services">
                    <span className="inline-block align-middle">
                      <ServiceBadgeList services={client.services} />
                    </span>
                  </DetailItem>
                  <DetailItem
                    label="Funding"
                    value={fundingShort(client.funding)}
                  />
                  <DetailItem
                    label="AA Status"
                    value={client.attendanceAllowance ?? "None"}
                  />
                  <DetailItem
                    label="Deprivation Flags"
                    value={deprivationFlags(client)}
                  />
                  <DetailItem label="Support Sought" value={client.headline} />
                  <DetailItem label="Care Requests" value={requestCount} />
                </div>
              ),
            },
          ]}
        />
      </div>
      <DialogFooter>
        {onEdit && <Button onClick={() => onEdit(client.id)}>Edit</Button>}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
