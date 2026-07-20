import {
  ArrowRight,
  FileCheck2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";
import { Eyebrow, ServiceBadgeList } from "../components/badges";
import { expiryStatus, formatDate, isWithinLastDays } from "../lib/dates";
import { useDemoData } from "../lib/store";

function StatTile({
  to,
  icon: Icon,
  value,
  label,
  sub,
  subTone = "muted",
}: {
  to: string;
  icon: typeof ShieldCheck;
  value: number;
  label: string;
  sub: string;
  subTone?: "muted" | "alert";
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-pk-line bg-white p-4 transition-colors hover:border-pk-blue/40"
    >
      <div className="flex items-start justify-between">
        <p className="font-display text-3xl font-bold tracking-tight">
          {value}
        </p>
        <Icon size={16} aria-hidden className="mt-1 text-pk-slate/70" />
      </div>
      <p className="mt-1.5 text-[13px] font-medium text-pk-ink">{label}</p>
      <p
        className={`mt-0.5 font-plex text-[11px] ${
          subTone === "alert" ? "text-pk-clay" : "text-pk-slate"
        }`}
      >
        {sub}
      </p>
    </Link>
  );
}

export default function CoordinatorHome() {
  const { providers, clients, volunteers, requests } = useDemoData();

  const dbsDue = [
    ...providers.map((provider) => provider.dbsExpiry),
    ...volunteers.map((volunteer) => volunteer.dbsExpiry),
  ].filter((date) => expiryStatus(date) !== "valid");

  const liabilityDue = providers
    .map((provider) => provider.liabilityExpiry)
    .filter((date) => expiryStatus(date) !== "valid");
  const liabilityExpired = liabilityDue.filter(
    (date) => expiryStatus(date) === "expired",
  ).length;

  const newThisWeek = clients.filter((client) =>
    isWithinLastDays(client.onboarded, 7),
  ).length;

  return (
    <div>
      <Eyebrow>Coordinator overview</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Good day, Wells.
      </h1>
      <p className="mt-2 text-[15px] text-pk-slate">
        {requests.length === 0
          ? "No new support requests waiting — here's the state of the network."
          : `${requests.length} support request${requests.length === 1 ? "" : "s"} in the book — here's the state of the network.`}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          to="/coordinator/compliance"
          icon={ShieldCheck}
          value={dbsDue.length}
          label="DBS renewals due"
          sub="within 90 days · providers & volunteers"
        />
        <StatTile
          to="/coordinator/compliance"
          icon={FileCheck2}
          value={liabilityDue.length}
          label="Public liability due"
          sub={
            liabilityExpired > 0
              ? `includes ${liabilityExpired} already expired`
              : "within 90 days"
          }
          subTone={liabilityExpired > 0 ? "alert" : "muted"}
        />
        <StatTile
          to="/coordinator/clients"
          icon={UserRound}
          value={clients.length}
          label="Clients"
          sub="total on file"
        />
        <StatTile
          to="/coordinator/clients"
          icon={Sparkles}
          value={newThisWeek}
          label="New this week"
          sub="onboarded via Find Support"
        />
      </div>

      <div className="mt-6">
        <Link
          to="/find-support"
          className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
        >
          <PlusCircle size={16} aria-hidden />
          Start a support request
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Recent requests</h2>
        {requests.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-pk-line bg-pk-sand px-6 py-8 text-center">
            <p className="text-sm text-pk-slate">
              Nothing yet. Requests submitted through Find Support appear
              here the moment they arrive.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {requests.map((request) => (
              <li key={request.id}>
                <Link
                  to={`/find-support/results/${request.id}`}
                  className="group block rounded-2xl border border-pk-line bg-white p-5 transition-colors hover:border-pk-blue/40"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-plex text-[11px] tracking-wide text-pk-slate uppercase">
                      {request.locality} · {formatDate(request.createdAt)} ·{" "}
                      {request.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-pk-blue group-hover:text-pk-blue-deep">
                      View matches <ArrowRight size={13} aria-hidden />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-[15px] font-semibold text-pk-ink">
                    “{request.headline}”
                  </p>
                  <div className="mt-3">
                    <ServiceBadgeList services={request.services} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
