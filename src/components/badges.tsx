import { expiryStatus, formatDate, formatYmdToDmy } from "../lib/dates";
import { feePaidText, isFeePaid } from "../lib/format";
import type { Service } from "../lib/types";

const chip =
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-plex text-[11px] whitespace-nowrap";

const serviceStyles: Record<Service, string> = {
  "Personal Care": "bg-pk-blue-soft text-pk-blue-deep",
  "Social and Community Support": "bg-pk-leaf-soft text-pk-leaf",
  "Help in the Home or Garden": "bg-pk-amber-soft text-pk-amber",
};

const serviceShort: Record<Service, string> = {
  "Personal Care": "Personal care",
  "Social and Community Support": "Social & community",
  "Help in the Home or Garden": "Home & garden",
};

export function ServiceBadge({ service }: { service: Service }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${serviceStyles[service]}`}
    >
      {serviceShort[service]}
    </span>
  );
}

export function ServiceBadgeList({ services }: { services: Service[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {services.map((service) => (
        <ServiceBadge key={service} service={service} />
      ))}
    </span>
  );
}

const expiryStyles = {
  valid: "bg-pk-leaf-soft text-pk-leaf",
  expiring: "bg-pk-amber-soft text-pk-amber",
  expired: "bg-pk-clay-soft text-pk-clay",
} as const;

export function ExpiryChip({ label, date }: { label?: string; date: string }) {
  const status = expiryStatus(date);
  // The chip shows just the date (plus an identifying label on cards);
  // the status wording lives in the colour and the tooltip.
  const text = [label, formatYmdToDmy(date)].filter(Boolean).join(" ");
  const wording =
    status === "expired"
      ? `Expired ${formatDate(date)}`
      : status === "expiring"
        ? `Expires ${formatDate(date)}`
        : `Valid to ${formatDate(date)}`;
  return (
    <span className={`${chip} ${expiryStyles[status]}`} title={wording}>
      {text}
    </span>
  );
}

// Fees are amber, not clay, when unpaid: chasing a subscription is admin,
// not the compliance red an expired DBS or insurance earns.
export function FeeChip({ date }: { date?: string }) {
  const paid = isFeePaid(date);
  return (
    <span
      className={`${chip} ${paid ? "bg-pk-leaf-soft text-pk-leaf" : "bg-pk-amber-soft text-pk-amber"}`}
      title={paid ? `Fee paid ${formatDate(date)}` : "Fee not yet paid"}
    >
      {feePaidText(date)}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-plex text-[11px] font-medium tracking-[0.14em] text-pk-slate uppercase">
      {children}
    </p>
  );
}
