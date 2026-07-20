import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Eyebrow, ExpiryChip, ServiceBadgeList } from "../components/badges";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";

export default function Providers() {
  const { providers } = useDemoData();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const filtered = providers.filter((provider) =>
    [provider.name, provider.locality, ...provider.services]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );

  return (
    <div>
      <Eyebrow>Micro-providers</Eyebrow>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {providers.length} accredited micro-providers
        </h1>
      </div>
      <label className="relative mt-5 block max-w-sm">
        <Search
          size={15}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-pk-slate"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, village or service…"
          aria-label="Search micro-providers"
          className="w-full rounded-lg border border-pk-line bg-white py-2 pr-3 pl-9 text-sm placeholder:text-pk-slate/50"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-pk-slate">
          No micro-provider matches “{query}”. Try a village or a service
          like “garden”.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((provider) => (
            <li
              key={provider.id}
              className="flex flex-col rounded-2xl border border-pk-line bg-white p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-bold">
                  {provider.name}
                </h2>
                <span className="flex items-center gap-1 font-plex text-[12px] whitespace-nowrap text-pk-slate">
                  <MapPin size={12} aria-hidden />
                  {provider.locality} · {provider.outwardPostcode}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-pk-slate">
                {provider.bio}
              </p>
              <p className="mt-2 font-plex text-[12px] text-pk-slate">
                {provider.availability}
              </p>
              <div className="mt-3">
                <ServiceBadgeList services={provider.services} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-pk-line pt-3.5">
                <div className="flex flex-wrap gap-1.5">
                  <ExpiryChip label="DBS" date={provider.dbsExpiry} />
                  <ExpiryChip label="Insurance" date={provider.liabilityExpiry} />
                </div>
                <span className="font-plex text-[11px] text-pk-slate">
                  accredited {formatDate(provider.startDate)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
