import { Eyebrow, ServiceBadgeList } from "../components/badges";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { Client } from "../lib/types";

const statusStyles: Record<Client["status"], string> = {
  Active: "bg-pk-leaf-soft text-pk-leaf",
  Matched: "bg-pk-blue-soft text-pk-blue-deep",
  "New request": "bg-pk-amber-soft text-pk-amber",
};

export default function Clients() {
  const { clients } = useDemoData();

  return (
    <div>
      <Eyebrow>Clients</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        {clients.length} clients on file
      </h1>
      <p className="mt-2 text-sm text-pk-slate">
        People supported through the network, including anyone onboarded via
        Find Support in this demo.
      </p>

      <ul className="mt-6 space-y-3">
        {clients.map((client) => (
          <li
            key={client.id}
            className="rounded-2xl border border-pk-line bg-white p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-[16px] font-bold">
                  {client.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[client.status]}`}
                >
                  {client.status}
                </span>
              </div>
              <span className="font-plex text-[11px] text-pk-slate">
                {client.locality} · onboarded {formatDate(client.onboarded)}
              </span>
            </div>
            <p className="mt-2 text-sm text-pk-slate">“{client.headline}”</p>
            <div className="mt-3">
              <ServiceBadgeList services={client.services} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
