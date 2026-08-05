import { daysUntil, formatYmdToDmy } from "./dates";
import { FUNDING_OPTIONS, type AreaCovered, type Client } from "./types";

// Paddock's deprivation flag derivation (routes/ClientsRoutes.tsx).
export function deprivationFlags(client: Client): string {
  if (client.deprivation?.income && client.deprivation?.health) return "Both";
  if (client.deprivation?.income) return "Income";
  if (client.deprivation?.health) return "Health";
  return "None";
}

const FUNDING_SHORT: Record<string, string> = {
  [FUNDING_OPTIONS[0]]: "Self-funded",
  [FUNDING_OPTIONS[1]]: "Direct Payments",
  [FUNDING_OPTIONS[2]]: "NHS PHB",
};

/** Table-length labels for the questionnaire's long funding options. */
export function fundingShort(funding?: string[]): string {
  return (funding ?? [])
    .map((option) => FUNDING_SHORT[option] ?? option)
    .join(", ");
}

// Paddock stores an unpaid fee as the literal "unpaid" rather than an empty
// date (shared/schemas/index.ts), so every fee reader goes through these two.
export function isFeePaid(feePaymentDate?: string): feePaymentDate is string {
  return Boolean(feePaymentDate) && feePaymentDate !== "unpaid";
}

/** The fee cell: the payment date in DD-MM-YYYY, or "Unpaid". */
export function feePaidText(feePaymentDate?: string): string {
  return isFeePaid(feePaymentDate) ? formatYmdToDmy(feePaymentDate) : "Unpaid";
}

/** A fee covers a year, so it falls due again on its first anniversary. */
const FEE_PERIOD_DAYS = 365;

/** Due for renewal: never paid, or last paid over a year ago. */
export function isFeeDue(feePaymentDate?: string): boolean {
  return (
    !isFeePaid(feePaymentDate) ||
    // daysUntil counts backwards for a date already gone by.
    daysUntil(feePaymentDate) < -FEE_PERIOD_DAYS
  );
}

/** Date input value for a fee: empty means unpaid, as in Paddock's MpForm. */
export function feeDateInput(feePaymentDate?: string): string {
  return isFeePaid(feePaymentDate) ? feePaymentDate : "";
}

export function areasCoveredText(areas?: AreaCovered[]): string {
  const list = areas ?? [];
  return list.includes("All") ? "All" : list.join(", ");
}
