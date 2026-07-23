import { ExpiryChip } from "../components/badges";
import {
  pageTitle,
  tableCard,
  tableEl,
  tbodyEl,
  tdEl,
  thEl,
  theadEl,
} from "../components/tableStyles";
import { daysUntil, expiryStatus } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { TrainingRecord } from "../lib/types";

interface Row {
  id: string;
  name: string;
  kind: "Micro-provider" | "Volunteer";
  dbsExpiry: string;
  liabilityExpiry?: string;
  nextTraining?: TrainingRecord;
  urgency: number;
}

function soonestTraining(records: TrainingRecord[]): TrainingRecord | undefined {
  return [...records].sort(
    (a, b) => daysUntil(a.expiry) - daysUntil(b.expiry),
  )[0];
}

export default function Compliance() {
  const { providers, volunteers } = useDemoData();

  const rows: Row[] = [
    ...providers.map((provider) => {
      const nextTraining = soonestTraining(provider.training);
      const dates = [
        provider.dbsExpiry,
        provider.publicLiabilityExpiry,
        ...(nextTraining ? [nextTraining.expiry] : []),
      ];
      return {
        id: provider.id,
        name: provider.name,
        kind: "Micro-provider" as const,
        dbsExpiry: provider.dbsExpiry,
        liabilityExpiry: provider.publicLiabilityExpiry,
        nextTraining,
        urgency: Math.min(...dates.map(daysUntil)),
      };
    }),
    ...volunteers.map((volunteer) => ({
      id: volunteer.id,
      name: volunteer.name,
      kind: "Volunteer" as const,
      dbsExpiry: volunteer.dbsExpiry,
      urgency: daysUntil(volunteer.dbsExpiry),
    })),
  ].sort((a, b) => a.urgency - b.urgency);

  const allDates = rows.flatMap((row) => [
    row.dbsExpiry,
    ...(row.liabilityExpiry ? [row.liabilityExpiry] : []),
    ...(row.nextTraining ? [row.nextTraining.expiry] : []),
  ]);
  const expired = allDates.filter((date) => expiryStatus(date) === "expired").length;
  const expiring = allDates.filter((date) => expiryStatus(date) === "expiring").length;

  return (
    <div>
      <h1 className={pageTitle}>Compliance</h1>
      <p className="mt-1 max-w-xl text-sm text-gray-600">
        {expired > 0 || expiring > 0 ? (
          <>
            <span className="font-medium text-red-700">{expired} expired</span>{" "}
            and{" "}
            <span className="font-medium text-amber-700">
              {expiring} due within 90 days
            </span>{" "}
            across the network — most urgent first.
          </>
        ) : (
          "Everything is in date. Renewals appear here 90 days before they're due."
        )}
      </p>

      <div className={`mt-5 ${tableCard}`}>
        <table className={tableEl}>
          <thead className={theadEl}>
            <tr>
              <th className={thEl}>Name</th>
              <th className={thEl}>Role</th>
              <th className={thEl}>DBS</th>
              <th className={thEl}>Public Liability</th>
              <th className={thEl}>Next Training Due</th>
            </tr>
          </thead>
          <tbody className={tbodyEl}>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60">
                <td className={`${tdEl} font-medium text-gray-800`}>
                  {row.name}
                </td>
                <td className={tdEl}>{row.kind}</td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  <ExpiryChip date={row.dbsExpiry} />
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {row.liabilityExpiry ? (
                    <ExpiryChip date={row.liabilityExpiry} />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {row.nextTraining ? (
                    <ExpiryChip
                      label={row.nextTraining.name}
                      date={row.nextTraining.expiry}
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
