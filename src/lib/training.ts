import type { TrainingRecord } from "./types";

// WCN's core course list, mirroring Paddock's coreTrainingRecordTypes
// (shared/const.ts) — record names must match these exactly to count.
export const CORE_TRAINING = [
  "Safeguarding Adults",
  "Moving & Handling",
  "Emergency First Aid",
] as const;

export interface CoreCompletion {
  earliestCoreExpiryDate: string; // "" when no core records exist
  coreCompletionRate: number; // 0–100
}

// Paddock's core-completion metric (server/db/mp/service.ts): per core
// course take the latest expiry; the rate is the share of core courses with
// any record, and the earliest of those latest expiries drives renewals.
export function coreCompletion(records: TrainingRecord[]): CoreCompletion {
  const latestPerCourse = CORE_TRAINING.map((course) =>
    records
      .filter((record) => record.name === course)
      .map((record) => record.expiry)
      .sort()
      .at(-1),
  ).filter((date): date is string => Boolean(date));

  return {
    earliestCoreExpiryDate: [...latestPerCourse].sort()[0] ?? "",
    coreCompletionRate: (100 * latestPerCourse.length) / CORE_TRAINING.length,
  };
}
