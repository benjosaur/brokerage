import { Eyebrow, ExpiryChip } from "../components/badges";
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
        provider.liabilityExpiry,
        ...(nextTraining ? [nextTraining.expiry] : []),
      ];
      return {
        id: provider.id,
        name: provider.name,
        kind: "Micro-provider" as const,
        dbsExpiry: provider.dbsExpiry,
        liabilityExpiry: provider.liabilityExpiry,
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
      <Eyebrow>Compliance</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        DBS, insurance &amp; training
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-pk-slate">
        {expired > 0 || expiring > 0 ? (
          <>
            <span className="font-medium text-pk-clay">
              {expired} expired
            </span>{" "}
            and{" "}
            <span className="font-medium text-pk-amber">
              {expiring} due within 90 days
            </span>{" "}
            across the network — most urgent first.
          </>
        ) : (
          "Everything is in date. Renewals appear here 90 days before they’re due."
        )}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-pk-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-pk-line font-plex text-[11px] tracking-wide text-pk-slate uppercase">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">DBS</th>
              <th className="px-5 py-3 font-medium">Public liability</th>
              <th className="px-5 py-3 font-medium">Next training due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-pk-line/60 last:border-0">
                <td className="px-5 py-3.5 font-medium">{row.name}</td>
                <td className="px-5 py-3.5 text-pk-slate">{row.kind}</td>
                <td className="px-5 py-3.5">
                  <ExpiryChip label="DBS" date={row.dbsExpiry} />
                </td>
                <td className="px-5 py-3.5">
                  {row.liabilityExpiry ? (
                    <ExpiryChip label="Insurance" date={row.liabilityExpiry} />
                  ) : (
                    <span className="text-pk-slate">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {row.nextTraining ? (
                    <ExpiryChip
                      label={row.nextTraining.name}
                      date={row.nextTraining.expiry}
                    />
                  ) : (
                    <span className="text-pk-slate">—</span>
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
