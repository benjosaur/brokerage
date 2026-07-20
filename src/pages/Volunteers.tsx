import { Eyebrow, ExpiryChip } from "../components/badges";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";

export default function Volunteers() {
  const { volunteers } = useDemoData();

  return (
    <div>
      <Eyebrow>Volunteers</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        {volunteers.length} WCN volunteers
      </h1>
      <p className="mt-2 text-sm text-pk-slate">
        The helpline and liaison team behind the brokerage service.
      </p>

      <ul className="mt-6 space-y-3">
        {volunteers.map((volunteer) => (
          <li
            key={volunteer.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pk-line bg-white p-5"
          >
            <div>
              <h2 className="font-display text-[16px] font-bold">
                {volunteer.name}
              </h2>
              <p className="mt-0.5 text-sm text-pk-slate">
                {volunteer.role} · {volunteer.locality}
              </p>
              <p className="mt-1 font-plex text-[12px] text-pk-slate">
                {volunteer.email} · {volunteer.phone}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <ExpiryChip label="DBS" date={volunteer.dbsExpiry} />
              <span className="font-plex text-[11px] text-pk-slate">
                volunteering since {formatDate(volunteer.since)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
