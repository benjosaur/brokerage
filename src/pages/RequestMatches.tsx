import { ArrowLeft, Check, Clock, Info, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ServiceBadgeList, ExpiryChip } from "../components/badges";
import { Dialog, DialogTitle } from "../components/Dialog";
import { DetailItem } from "../components/modals/DetailItem";
import {
  pageTitle,
  primaryButton,
  secondaryButton,
  totalPill,
} from "../components/tableStyles";
import { formatDate } from "../lib/dates";
import { fundingShort } from "../lib/format";
import { buildMailto } from "../lib/mailto";
import { matchProviders } from "../lib/matching";
import { useDemoData } from "../lib/store";

const card =
  "rounded-xl border border-gray-200/60 bg-white/80 shadow-sm backdrop-blur-sm";

/** One condition row in the "How matches work" modal (Results.tsx dialect). */
function MatchCheck({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed">
      <Check size={15} className="mt-0.5 shrink-0 text-green-600" aria-hidden />
      <span className="text-gray-600">
        <span className="font-semibold text-gray-700">{title}:</span> {detail}
      </span>
    </li>
  );
}

// Coordinator's view of one support request and its matches. The public
// results page (Results.tsx) stays requester-facing; this one lives in the
// dashboard shell and shows the contact details the public page withholds.
export default function RequestMatches() {
  const { requestId } = useParams<{ requestId: string }>();
  const { providers, requests } = useDemoData();
  const [showMatchInfo, setShowMatchInfo] = useState(false);
  const request = requests.find((entry) => entry.id === requestId);

  if (!request) {
    return (
      <div className="animate-in space-y-6">
        <h1 className={pageTitle}>Request not found</h1>
        <p className="text-sm text-gray-600">
          This request may have been cleared when the demo data was reset.
        </p>
        <Link to="/coordinator" className={secondaryButton}>
          <ArrowLeft size={15} aria-hidden />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const matches = matchProviders(providers, request);
  const canEmail = request.consentWcnNetwork;

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h1 className={pageTitle}>Request Matches</h1>
          <span className={totalPill}>Matches: {matches.length}</span>
        </div>
        <Link to="/coordinator" className={secondaryButton}>
          <ArrowLeft size={15} aria-hidden />
          Back to dashboard
        </Link>
      </div>

      <section className={`${card} p-6`}>
        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
          {request.locality} · {formatDate(request.createdAt)} · {request.name}
        </p>
        <blockquote className="mt-2 text-xl font-semibold text-gray-800">
          “{request.headline}”
        </blockquote>
        <div className="mt-4 grid gap-x-10 text-sm md:grid-cols-2">
          <DetailItem
            label="Contact"
            value={[request.email, request.phone].filter(Boolean).join(" · ")}
          />
          <DetailItem label="Completed by" value={request.completedBy} />
          <DetailItem label="Funding" value={fundingShort(request.funding)} />
          <DetailItem label="Days and times" value={request.schedule} />
          <DetailItem label="Person sought" value={request.personSought} />
          <DetailItem
            label="Pets"
            value={request.hasPets ? request.petDetails || "Yes" : "No"}
          />
        </div>
        <div className="text-sm">
          <DetailItem label="Circumstances" value={request.circumstances} />
          <DetailItem label="Other support" value={request.servicesOther} />
          <DetailItem label="Services">
            <span className="inline-block align-middle">
              <ServiceBadgeList services={request.services} />
            </span>
          </DetailItem>
        </div>
      </section>

      {!canEmail && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info className="mt-0.5 shrink-0 text-amber-600" size={18} aria-hidden />
          <p className="text-sm leading-relaxed text-amber-800">
            Sharing consent wasn’t given on this request, so provider emails
            are switched off. WCN would contact the requester first to talk
            through the options.
          </p>
        </div>
      )}

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {matches.length === 0
              ? "No matching micro-providers right now"
              : "Matching micro-providers"}
          </h2>
          <button
            type="button"
            onClick={() => setShowMatchInfo(true)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            <Info size={14} aria-hidden />
            How matches work
          </button>
        </div>
        {matches.length === 0 ? (
          <div className={`${card} mt-3 p-6`}>
            <p className="text-sm text-gray-600">
              No one currently covers {request.locality} for that mix of
              support. The WCN Helpline (01749 467079) keeps a waiting list
              and can widen the search to nearby networks.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-4">
            {matches.map(({ provider, sameLocality }) => (
              <li key={provider.id} className={`${card} p-6`}>
                <h3 className="text-lg font-semibold text-gray-800">
                  {provider.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin size={14} className="shrink-0 text-gray-400" aria-hidden />
                  {provider.locality} · {provider.outwardPostcode}
                  {sameLocality && (
                    <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-blue-700">
                      Same area
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {provider.bio}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock size={14} className="shrink-0 text-gray-400" aria-hidden />
                  {provider.availability}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <ServiceBadgeList services={provider.services} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/60 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <ExpiryChip label="DBS" date={provider.dbsExpiry} />
                    <ExpiryChip
                      label="Insurance"
                      date={provider.publicLiabilityExpiry}
                    />
                  </div>
                  {canEmail ? (
                    <a href={buildMailto(provider, request)} className={primaryButton}>
                      <Mail size={15} aria-hidden />
                      Draft email
                    </a>
                  ) : (
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
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

      <Dialog
        open={showMatchInfo}
        onClose={() => setShowMatchInfo(false)}
        className="sm:max-w-md"
      >
        <DialogTitle>How matches work</DialogTitle>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Matches only include micro-providers approved by Wells Community
          Network who pass all of these checks:
        </p>
        <ul className="mt-4 space-y-3">
          <MatchCheck
            title="Covers the client’s area"
            detail="the areas they work in include the client’s town or village."
          />
          <MatchCheck
            title="Offers a requested service"
            detail="they offer at least one of the services requested, or any service when none were selected."
          />
          <MatchCheck
            title="DBS check in date"
            detail="their DBS check has not expired."
          />
          <MatchCheck
            title="Insurance in date"
            detail="their public liability insurance has not expired."
          />
        </ul>
        <p className="mt-4 border-t border-gray-200/60 pt-4 text-sm leading-relaxed text-gray-600">
          Closest matches come first: micro-providers based in the client’s
          own town or village, then those offering more of the requested
          services.
        </p>
      </Dialog>
    </div>
  );
}
