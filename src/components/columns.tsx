import { FeeChip } from "./badges";
import type { TableColumn } from "./DataTable";
import { feePaidText } from "../lib/format";

// Column definitions shared by more than one table, so the same field can
// never drift between the entity page and the tabbed admin page.

/** Anyone who pays WCN a fee: clients (membership) and micro-providers. */
interface FeePayer {
  feePaymentDate: string;
}

// Paddock's MP "Fee Date" column (routes/MpsRoutes.tsx) — same field and
// "Unpaid" fallback, rendered as a chip in the demo's date dialect.
// "unpaid" sorts after every date, so ascending leaves the chase list last
// and descending brings it to the top.
export const feePaidColumn: TableColumn<FeePayer> = {
  key: "feePaymentDate",
  header: "Fee Paid",
  render: (item) => <FeeChip date={item.feePaymentDate} />,
  text: (item) => feePaidText(item.feePaymentDate),
  sortValue: (item) => item.feePaymentDate || null,
};
