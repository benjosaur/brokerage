import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eyebrow } from "../components/badges";
import { submitRequest } from "../lib/store";
import {
  COMPLETED_BY_OPTIONS,
  FUNDING_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  LOCALITIES,
  SERVICES,
  type Service,
} from "../lib/types";

const STEPS = [
  "Screening",
  "Support needs",
  "About you",
  "Consent",
  "Staying in touch",
  "Confirm",
] as const;

type YesNo = "" | "Yes" | "No";

interface FormState {
  completedBy: string;
  confirmConsent: YesNo;
  confirmAssess: YesNo;
  confirmCoordinate: YesNo;
  confirmCommunicate: YesNo;
  services: Service[];
  funding: string[];
  name: string;
  email: string;
  phone: string;
  headline: string;
  locality: string;
  personSought: string;
  circumstances: string;
  pets: YesNo;
  petDetails: string;
  schedule: string;
  consentWcn: YesNo;
  consentOther: YesNo;
  heardAbout: string;
  newsletter: YesNo;
  disclaimerRead: boolean;
  accurateInfo: boolean;
}

const initialState: FormState = {
  completedBy: "",
  confirmConsent: "",
  confirmAssess: "",
  confirmCoordinate: "",
  confirmCommunicate: "",
  services: [],
  funding: [],
  name: "",
  email: "",
  phone: "",
  headline: "",
  locality: "",
  personSought: "",
  circumstances: "",
  pets: "",
  petDetails: "",
  schedule: "",
  consentWcn: "",
  consentOther: "",
  heardAbout: "",
  newsletter: "",
  disclaimerRead: false,
  accurateInfo: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

const SCREENING_QUESTIONS = [
  {
    field: "confirmConsent" as const,
    title:
      "The individual requiring support has given their consent for this referral.",
    detail: "",
  },
  {
    field: "confirmAssess" as const,
    title:
      "The person receiving support, or their legal representative, is willing and able to assess the suitability of a micro-provider.",
    detail:
      "Micro-providers are accredited by Somerset Council but have not had the checks that CQC-regulated providers have. The person being cared for (or their representative) will need to interview potential providers and decide whether they are a good fit.",
  },
  {
    field: "confirmCoordinate" as const,
    title:
      "They are willing and able to co-ordinate and manage their care on an ongoing basis.",
    detail:
      "Using a micro-provider puts the person receiving care in full control: flexible and personal, but the family is responsible for finding, assessing and managing any micro-provider(s), sometimes more than one to cover different tasks and times.",
  },
  {
    field: "confirmCommunicate" as const,
    title:
      "They are willing and able to communicate what they need, when they need it.",
    detail:
      "Micro-providers cannot direct or manage care. They take their direction from the person receiving care or their legal representative.",
  },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] text-pk-clay">{message}</p>;
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] font-medium text-pk-ink">{children}</p>;
}

function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[13px] leading-relaxed text-pk-slate">{children}</p>
  );
}

function YesNoChoice({
  value,
  onChange,
  name,
  labels,
}: {
  value: YesNo;
  onChange: (next: YesNo) => void;
  name: string;
  labels?: Partial<Record<"Yes" | "No", string>>;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-3 flex flex-wrap gap-2">
      {(["Yes", "No"] as const).map((option) => (
        <label
          key={option}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
            value === option
              ? "border-pk-blue bg-pk-blue-soft font-medium text-pk-blue-deep"
              : "border-pk-line bg-white text-pk-slate hover:border-pk-slate/40"
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {labels?.[option] ?? option}
        </label>
      ))}
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
        checked
          ? "border-pk-blue bg-pk-blue-soft/60"
          : "border-pk-line bg-white hover:border-pk-slate/40"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-pk-blue"
      />
      <span className="leading-snug">{children}</span>
    </label>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-pk-line bg-white px-3 py-2 text-sm placeholder:text-pk-slate/50";

export default function FindSupport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rejected, setRejected] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const toggleInList = (field: "services" | "funding", value: string) => {
    setForm((prev) => {
      const list = prev[field] as string[];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [field]: next };
    });
  };

  const validateStep = (): Errors => {
    const found: Errors = {};
    if (step === 0) {
      if (!form.completedBy) found.completedBy = "Choose one option.";
      for (const question of SCREENING_QUESTIONS) {
        if (!form[question.field]) found[question.field] = "Answer Yes or No.";
      }
    }
    if (step === 2) {
      if (!form.name.trim()) found.name = "Enter the name of the person needing support.";
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
        found.email = "Enter an email address so WCN can reply with options.";
      if (!form.phone.trim()) found.phone = "Enter a phone number.";
      if (!form.headline.trim()) found.headline = "Write a one-sentence headline.";
      if (form.headline.length > 255)
        found.headline = "Keep the headline to 255 characters or fewer.";
      if (!form.locality) found.locality = "Choose the nearest town or village.";
      if (!form.personSought.trim())
        found.personSought = "Describe the kind of person or service you're looking for.";
      if (!form.circumstances.trim())
        found.circumstances = "Add a little about the situation; it helps the match.";
      if (!form.pets) found.pets = "Answer Yes or No.";
      if (!form.schedule.trim())
        found.schedule = "Say which days, times and hours you have in mind.";
    }
    if (step === 3) {
      if (!form.consentWcn) found.consentWcn = "Answer Yes or No.";
      if (!form.consentOther) found.consentOther = "Answer Yes or No.";
    }
    if (step === 4) {
      if (!form.heardAbout) found.heardAbout = "Choose one option.";
      if (!form.newsletter) found.newsletter = "Answer Yes or No.";
    }
    if (step === 5) {
      if (!form.disclaimerRead)
        found.disclaimerRead = "Confirm you have read the disclaimer.";
      if (!form.accurateInfo)
        found.accurateInfo = "Confirm the information is accurate.";
    }
    return found;
  };

  const handleContinue = () => {
    const found = validateStep();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if (step === 0) {
      const anyNo = SCREENING_QUESTIONS.some(
        (question) => form[question.field] === "No",
      );
      if (anyNo) {
        setRejected(true);
        return;
      }
    }
    if (step === STEPS.length - 1) {
      const request = submitRequest({
        completedBy: form.completedBy,
        services: form.services,
        funding: form.funding,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        headline: form.headline.trim(),
        locality: form.locality,
        personSought: form.personSought.trim(),
        circumstances: form.circumstances.trim(),
        hasPets: form.pets === "Yes",
        petDetails: form.petDetails.trim(),
        schedule: form.schedule.trim(),
        consentWcnNetwork: form.consentWcn === "Yes",
        consentOtherNetworks: form.consentOther === "Yes",
        heardAbout: form.heardAbout,
        newsletter: form.newsletter === "Yes",
      });
      navigate(`/find-support/results/${request.id}`);
      return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  };

  const handleBack = () => {
    setErrors({});
    setStep(Math.max(0, step - 1));
    window.scrollTo({ top: 0 });
  };

  if (rejected) {
    return (
      <div className="max-w-xl animate-rise">
        <Eyebrow>Support Near You</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance">
          Micro-providers may not be the right option at this time
        </h1>
        <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-pk-slate">
          <p>
            Based on these answers, a micro-provider may not be the most
            suitable option: this model asks individuals or families to
            manage and co-ordinate care independently.
          </p>
          <p>
            You may wish to explore CQC-regulated care providers or speak with
            your local council about alternative support.
          </p>
          <p>
            If you feel this isn’t accurate and you’d like to proceed, contact
            WCN at{" "}
            <span className="font-plex text-[13px] text-pk-ink">
              wcnmicroproviders@gmail.com
            </span>{" "}
            or call the helpline on{" "}
            <span className="font-plex text-[13px] text-pk-ink">
              01749 467079
            </span>
            .
          </p>
        </div>
        <div className="mt-7 flex gap-3">
          <button
            onClick={() => {
              setRejected(false);
              setForm((prev) => ({
                ...prev,
                confirmConsent: "",
                confirmAssess: "",
                confirmCoordinate: "",
                confirmCommunicate: "",
              }));
            }}
            className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-pk-blue-deep"
          >
            <RotateCcw size={15} aria-hidden /> Start again
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-[10px] border border-pk-line bg-white px-4 py-2.5 text-sm font-medium hover:border-pk-slate/40"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Eyebrow>Support Near You - find a micro-provider</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        {STEPS[step]}
      </h1>
      <div className="mt-4">
        <p className="font-plex text-[11px] text-pk-slate">
          Section {step + 1} of {STEPS.length}
        </p>
        <div className="mt-1.5 h-1 rounded-full bg-pk-fog">
          <div
            className="h-1 rounded-full bg-pk-blue transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-7">
        {step === 0 && (
          <>
            <p className="text-sm leading-relaxed text-pk-slate">
              A few questions first, to make sure micro-providers are right
              for you. Most micro-providers don’t meet the criteria to be
              regulated by the Care Quality Commission; that doesn’t make
              them unsafe or low quality, but it does mean they suit people
              who want control over who supports them, when and how.
            </p>
            <div>
              <QuestionLabel>Who is completing this form?</QuestionLabel>
              <div className="mt-3 space-y-2">
                {COMPLETED_BY_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                      form.completedBy === option
                        ? "border-pk-blue bg-pk-blue-soft font-medium text-pk-blue-deep"
                        : "border-pk-line bg-white hover:border-pk-slate/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="completedBy"
                      checked={form.completedBy === option}
                      onChange={() => set("completedBy", option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <FieldError message={errors.completedBy} />
            </div>
            {SCREENING_QUESTIONS.map((question) => (
              <div key={question.field}>
                <QuestionLabel>{question.title}</QuestionLabel>
                {question.detail && <HelpText>{question.detail}</HelpText>}
                <YesNoChoice
                  name={question.field}
                  value={form[question.field]}
                  onChange={(next) => set(question.field, next)}
                />
                <FieldError message={errors[question.field]} />
              </div>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm leading-relaxed text-pk-slate">
              Great news: it sounds like a micro-provider could be the right
              option. Tell us what kind of support you’re looking for.
            </p>
            <div>
              <QuestionLabel>What type of support are you looking for?</QuestionLabel>
              <div className="mt-3 space-y-2">
                {SERVICES.map((service) => (
                  <CheckboxRow
                    key={service}
                    checked={form.services.includes(service)}
                    onChange={() => toggleInList("services", service)}
                  >
                    {service}
                  </CheckboxRow>
                ))}
              </div>
            </div>
            <div>
              <QuestionLabel>How will your care and support be funded?</QuestionLabel>
              <div className="mt-3 space-y-2">
                {FUNDING_OPTIONS.map((option) => (
                  <CheckboxRow
                    key={option}
                    checked={form.funding.includes(option)}
                    onChange={() => toggleInList("funding", option)}
                  >
                    {option}
                  </CheckboxRow>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-[15px] font-medium" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="email">
                Email address
              </label>
              <HelpText>
                Please make sure your email is accurate; WCN will contact
                you here with local care options.
              </HelpText>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.email} />
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="phone">
                Phone number
              </label>
              <HelpText>This will not be shared with micro-providers.</HelpText>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.phone} />
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="headline">
                Give your request a one-sentence headline
              </label>
              <HelpText>
                Think along the lines of a recruitment ad; it attracts more
                interest from micro-providers. For example: “Wells-based
                former teacher and nature enthusiast, 82, looking for help
                around the home.”
              </HelpText>
              <textarea
                id="headline"
                rows={2}
                maxLength={255}
                value={form.headline}
                onChange={(event) => set("headline", event.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-right font-plex text-[11px] text-pk-slate">
                {form.headline.length}/255
              </p>
              <FieldError message={errors.headline} />
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="locality">
                Where is support required?
              </label>
              <HelpText>
                The nearest town or village; please don’t include an exact
                address.
              </HelpText>
              <select
                id="locality"
                value={form.locality}
                onChange={(event) => set("locality", event.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Choose a town or village…
                </option>
                {LOCALITIES.map((locality) => (
                  <option key={locality} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
              <FieldError message={errors.locality} />
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="personSought">
                Is there a particular type of person or service you’re looking
                for?
              </label>
              <HelpText>
                Specific skills or experience, values and background; perhaps
                someone bubbly and outgoing with moving-and-handling
                experience, or calm and patient with experience in dementia.
              </HelpText>
              <textarea
                id="personSought"
                rows={3}
                value={form.personSought}
                onChange={(event) => set("personSought", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.personSought} />
            </div>
            <div>
              <label
                className="text-[15px] font-medium"
                htmlFor="circumstances"
              >
                Anything else you’d like to share about your situation?
              </label>
              <HelpText>
                Tasks you’d like completed, any medical conditions you’re
                comfortable sharing, whether you’re building a care team, and
                a little about yourself and what a good life means to you.
              </HelpText>
              <textarea
                id="circumstances"
                rows={4}
                value={form.circumstances}
                onChange={(event) => set("circumstances", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.circumstances} />
            </div>
            <div>
              <QuestionLabel>Are there any pets in the house?</QuestionLabel>
              <YesNoChoice
                name="pets"
                value={form.pets}
                onChange={(next) => set("pets", next)}
                labels={{ Yes: "Yes, please indicate how many and what sort" }}
              />
              <FieldError message={errors.pets} />
              {form.pets === "Yes" && (
                <div className="mt-3">
                  <label
                    className="text-sm font-medium"
                    htmlFor="petDetails"
                  >
                    Please give details of any pets
                  </label>
                  <textarea
                    id="petDetails"
                    rows={2}
                    value={form.petDetails}
                    onChange={(event) => set("petDetails", event.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-[15px] font-medium" htmlFor="schedule">
                Days, times and hours
              </label>
              <HelpText>
                How many days a week you’d like help, specific days and
                times, and how long is needed for each visit.
              </HelpText>
              <textarea
                id="schedule"
                rows={3}
                value={form.schedule}
                onChange={(event) => set("schedule", event.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.schedule} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm leading-relaxed text-pk-slate">
              To find suitable micro-providers, WCN may share some
              non-personal information from this form: the type of support
              needed, or general availability. Personal details like your
              name, contact details or address are never shared without your
              explicit permission.
            </p>
            <div>
              <QuestionLabel>
                I consent to non-personal information being shared with
                micro-providers registered with Wells Community Network.
              </QuestionLabel>
              <YesNoChoice
                name="consentWcn"
                value={form.consentWcn}
                onChange={(next) => set("consentWcn", next)}
              />
              <FieldError message={errors.consentWcn} />
            </div>
            <div>
              <QuestionLabel>
                I consent to non-personal information being shared with
                micro-providers registered with other micro-provider networks.
              </QuestionLabel>
              <YesNoChoice
                name="consentOther"
                value={form.consentOther}
                onChange={(next) => set("consentOther", next)}
              />
              <FieldError message={errors.consentOther} />
            </div>
            <p className="text-[13px] text-pk-slate">
              You can change or withdraw consent at any time; email
              wcnmicroproviders@gmail.com or call the WCN Helpline on 01749
              467079.
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <label className="text-[15px] font-medium" htmlFor="heardAbout">
                How did you hear about WCN micro-providers?
              </label>
              <select
                id="heardAbout"
                value={form.heardAbout}
                onChange={(event) => set("heardAbout", event.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Choose one…
                </option>
                {HEARD_ABOUT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={errors.heardAbout} />
            </div>
            <div>
              <QuestionLabel>
                Would you like to receive the WCN newsletter?
              </QuestionLabel>
              <HelpText>
                Fortnightly updates on WCN’s work, local support and positive
                community news. Unsubscribe at any time.
              </HelpText>
              <YesNoChoice
                name="newsletter"
                value={form.newsletter}
                onChange={(next) => set("newsletter", next)}
                labels={{ Yes: "Yes, please", No: "No, thank you" }}
              />
              <FieldError message={errors.newsletter} />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="rounded-xl border border-pk-line bg-pk-sand p-5 text-[13px] leading-relaxed text-pk-slate">
              <p className="font-medium text-pk-ink">Disclaimer</p>
              <p className="mt-2">
                Wells Community Network provides information and signposting
                to independent micro-providers as a community support service.
                It is not a brokerage, commissioning or referral service and
                does not assess, recommend, endorse, employ or monitor any
                provider listed. Any decision to contact or engage a provider
                is made entirely at the individual’s or family’s own
                discretion; please carry out your own checks, including
                suitability, qualifications, references, safeguarding,
                insurance and any regulatory requirements, before entering
                into any agreement.
              </p>
            </div>
            <div className="space-y-2">
              <CheckboxRow
                checked={form.disclaimerRead}
                onChange={(next) => set("disclaimerRead", next)}
              >
                I have read and understood the disclaimer.
              </CheckboxRow>
              <FieldError message={errors.disclaimerRead} />
              <CheckboxRow
                checked={form.accurateInfo}
                onChange={(next) => set("accurateInfo", next)}
              >
                The information I have provided is accurate to the best of my
                knowledge.
              </CheckboxRow>
              <FieldError message={errors.accurateInfo} />
            </div>
          </>
        )}
      </div>

      <div className="mt-9 flex items-center justify-between border-t border-pk-line pt-5">
        {step > 0 ? (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-pk-slate hover:text-pk-ink"
          >
            <ArrowLeft size={15} aria-hidden /> Back
          </button>
        ) : (
          <Link to="/" className="text-sm text-pk-slate hover:text-pk-ink">
            Cancel
          </Link>
        )}
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
        >
          {step === STEPS.length - 1 ? "Submit request" : "Continue"}
          <ArrowRight size={15} aria-hidden />
        </button>
      </div>
    </div>
  );
}
