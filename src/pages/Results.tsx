import { Check, CheckCircle2, Clock, Info, Mail, MapPin, X } from "lucide-react";
import { Link, useParams } from "react-router";
import { ServiceBadgeList } from "../components/badges";
import { expiryStatus } from "../lib/dates";
import { FORM_META } from "../lib/formContent";
import { buildMailto } from "../lib/mailto";
import { matchProviders } from "../lib/matching";
import { useDemoData } from "../lib/store";

const pillClass =
  "inline-flex items-center rounded-full bg-pk-fog px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-pk-slate";

/** Minimal compliance marker: a tick while in date, a cross once expired. */
function ComplianceTick({ label, date }: { label: string; date: string }) {
  const expired = expiryStatus(date) === "expired";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium text-pk-slate"
      aria-label={`${label} ${expired ? "expired" : "valid"}`}
    >
      {expired ? (
        <X size={14} className="text-pk-clay" aria-hidden />
      ) : (
        <Check size={14} className="text-pk-leaf" aria-hidden />
      )}
      {label}
    </span>
  );
}

export default function Results() {
  const { requestId } = useParams<{ requestId: string }>();
  const { providers, requests } = useDemoData();
  const request = requests.find((entry) => entry.id === requestId);

  if (!request) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-2xl font-bold">Request not found</h1>
        <p className="mt-2 text-sm text-pk-slate">
          This request may have been cleared when the demo data was reset.
        </p>
        <Link
          to="/find-support"
          className="mt-5 inline-flex rounded-[10px] bg-pk-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-pk-blue-deep"
        >
          Start a new request
        </Link>
      </div>
    );
  }

  const matches = matchProviders(providers, request);
  const canEmail = request.consentWcnNetwork;

  return (
    <div>
      <div className="flex items-start gap-3 rounded-2xl border border-pk-leaf/25 bg-pk-leaf-soft p-4">
        <CheckCircle2 className="mt-0.5 shrink-0 text-pk-leaf" size={18} aria-hidden />
        <p className="text-sm leading-relaxed font-medium text-pk-leaf">
          {FORM_META.confirmationMessage}
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-pk-line bg-pk-sand p-6">
        <p className="text-sm font-medium text-pk-slate">Your request</p>
        <blockquote className="mt-2 font-display text-2xl font-bold tracking-tight text-balance">
          “{request.headline}”
        </blockquote>
        <div className="mt-4 space-y-2 text-sm text-pk-ink">
          <p className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-pk-slate" aria-hidden />
            {request.locality}
          </p>
          <p className="flex items-start gap-2">
            <Clock size={15} className="mt-0.5 shrink-0 text-pk-slate" aria-hidden />
            {request.schedule}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ServiceBadgeList services={request.services} />
          {request.servicesOther && (
            <span className={pillClass}>Other: {request.servicesOther}</span>
          )}
          <span className={pillClass}>{request.hasPets ? "Pets at home" : "No pets"}</span>
        </div>
      </section>

      {!canEmail && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-pk-amber/30 bg-pk-amber-soft p-4">
          <Info className="mt-0.5 shrink-0 text-pk-amber" size={18} aria-hidden />
          <p className="text-sm leading-relaxed text-pk-amber">
            Sharing consent wasn’t given on this request, so provider emails
            are switched off. WCN would contact you first to talk through the
            options.
          </p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">
          {matches.length === 0
            ? "No matching micro-providers right now"
            : `${matches.length} matching micro-provider${matches.length === 1 ? "" : "s"}`}
        </h2>
        {matches.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-pk-line bg-pk-sand px-6 py-8">
            <p className="text-sm leading-relaxed text-pk-slate">
              No one currently covers {request.locality} for that mix of
              support. The WCN Helpline (01749 467079) keeps a waiting list
              and can widen the search to nearby networks.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {matches.map(({ provider, sameLocality }, index) => (
              <li
                key={provider.id}
                className="animate-rise rounded-2xl border border-pk-line bg-white p-5 shadow-[0_8px_24px_rgba(28,39,51,0.04)]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h3 className="font-display text-lg font-bold">
                  {provider.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-pk-slate">
                  <MapPin size={14} className="shrink-0" aria-hidden />
                  {provider.locality} · {provider.outwardPostcode}
                  {sameLocality && (
                    <span className="ml-1 rounded-full bg-pk-blue-soft px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-pk-blue-deep">
                      Same area
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-pk-slate">
                  {provider.bio}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-pk-slate">
                  <Clock size={14} className="shrink-0" aria-hidden />
                  {provider.availability}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <ServiceBadgeList services={provider.services} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-pk-line pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <ComplianceTick label="DBS" date={provider.dbsExpiry} />
                    <ComplianceTick
                      label="Insurance"
                      date={provider.publicLiabilityExpiry}
                    />
                  </div>
                  {canEmail ? (
                    <a
                      href={buildMailto(provider, request)}
                      className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
                    >
                      <Mail size={15} aria-hidden />
                      Draft email
                    </a>
                  ) : (
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] bg-pk-fog px-4 py-2 text-sm font-medium text-pk-slate"
                      title="No sharing consent on this request"
                    >
                      <Mail size={15} aria-hidden />
                      Draft email
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-pk-line pt-6">
        <Link
          to="/find-support"
          className="inline-flex items-center rounded-[10px] border border-pk-line bg-white px-4 py-2.5 text-sm font-medium hover:border-pk-slate/40"
        >
          Start another request
        </Link>
        <Link to="/" className="inline-flex items-center px-2 py-2.5 text-sm text-pk-slate hover:text-pk-ink">
          Back to home
        </Link>
      </div>
    </div>
  );
}
