import { Button } from "../Button";
import { Dialog, DialogFooter, DialogTitle } from "../Dialog";
import { TrainingRecordsTable } from "../TrainingRecordsTable";
import { useDemoData } from "../../lib/store";

// Port of Paddock's TrainingRecordDetailModal: the per-carer record list
// behind a row on the Records page.
export function TrainingRecordDetailModal({
  carerId,
  isOpen,
  onClose,
}: {
  carerId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { providers, volunteers } = useDemoData();
  const carer =
    providers.find((entry) => entry.id === carerId) ??
    volunteers.find((entry) => entry.id === carerId);
  if (!carer) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="flex h-[80vh] w-[80vw] flex-col gap-4"
    >
      <DialogTitle>Training Records {carer.name}</DialogTitle>
      <div className="flex-grow overflow-y-auto pr-2">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Records</h3>
        {carer.training.length > 0 ? (
          <TrainingRecordsTable data={carer.training} />
        ) : (
          <p className="text-sm text-gray-500">
            No training records found for this carer.
          </p>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
