import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import wcnLogo from "../assets/wcn-logo.png";
import { FormattedText, QuestionCard } from "../components/questionnaire/QuestionCard";
import SectionHeader from "../components/questionnaire/SectionHeader";
import {
  CheckOptions,
  RadioOptions,
  TextField,
  textFieldClass,
} from "../components/questionnaire/inputs";
import {
  FORM_META,
  FORM_SECTIONS,
  type FieldKey,
  type FormItem,
  type FormQuestion,
} from "../lib/formContent";
import { submitRequest } from "../lib/store";
import { LOCALITIES, SERVICES, type Service } from "../lib/types";

// All question/section/option copy comes verbatim from src/lib/formContent.ts
// (generated from the live Google Form) — nothing user-facing is reworded here.

interface FormState {
  completedBy: string;
  confirmConsent: string;
  confirmAssess: string;
  confirmCoordinate: string;
  confirmCommunicate: string;
  services: string[];
  servicesOtherChecked: boolean;
  servicesOther: string;
  funding: string[];
  name: string;
  email: string;
  phone: string;
  headline: string;
  locality: string;
  personSought: string;
  circumstances: string;
  pets: string;
  petDetails: string;
  schedule: string;
  consentWcn: string;
  consentOther: string;
  heardAbout: string;
  heardAboutOther: string;
  newsletter: string;
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
  servicesOtherChecked: false,
  servicesOther: "",
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
  heardAboutOther: "",
  newsletter: "",
  disclaimerRead: false,
  accurateInfo: false,
};

type Errors = Partial<Record<FieldKey, string>>;

// Google Forms' own wording for an empty required answer.
const REQUIRED_MESSAGE = "This is a required question";

const SCREENING_KEYS = [
  "confirmConsent",
  "confirmAssess",
  "confirmCoordinate",
  "confirmCommunicate",
] as const;

const QUESTION_KEYS: FieldKey[] = FORM_SECTIONS.flatMap((section) =>
  section.items.flatMap((item) => (item.kind === "note" ? [] : [item.key])),
);

const TEXTAREA_ROWS: Partial<Record<FieldKey, number>> = {
  headline: 2,
  personSought: 3,
  circumstances: 4,
  petDetails: 2,
  schedule: 3,
};

const AUTOCOMPLETE: Partial<Record<FieldKey, string>> = {
  name: "name",
  email: "email",
  phone: "tel",
};

const petDetailsHidden = (form: FormState) => form.pets === "" || form.pets === "No";

function isAnswered(key: FieldKey, form: FormState): boolean {
  switch (key) {
    case "services":
      return form.services.length > 0 || (form.servicesOtherChecked && form.servicesOther.trim() !== "");
    case "funding":
      return form.funding.length > 0;
    case "heardAbout":
      return form.heardAbout === "Other" ? form.heardAboutOther.trim() !== "" : form.heardAbout !== "";
    case "disclaimerRead":
      return form.disclaimerRead;
    case "accurateInfo":
      return form.accurateInfo;
    default: {
      const value = form[key];
      return typeof value === "string" && value.trim() !== "";
    }
  }
}

function countProgress(form: FormState): { answered: number; total: number } {
  let answered = 0;
  let total = 0;
  for (const key of QUESTION_KEYS) {
    if (key === "petDetails" && petDetailsHidden(form)) continue;
    total += 1;
    if (isAnswered(key, form)) answered += 1;
  }
  return { answered, total };
}

function validateSection(index: number, form: FormState): Errors {
  const found: Errors = {};
  for (const item of FORM_SECTIONS[index].items) {
    if (item.kind === "note") continue;
    const key = item.key;
    if (key === "email") {
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        found.email = form.email.trim() === "" ? REQUIRED_MESSAGE : "Enter a valid email address.";
      }
      continue;
    }
    if (key === "headline" && form.headline.length > 255) {
      found.headline = "Keep the headline to 255 characters or fewer.";
      continue;
    }
    if (!item.required) continue;
    if (!isAnswered(key, form)) found[key] = REQUIRED_MESSAGE;
  }
  return found;
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep";
const outlineButton =
  "inline-flex items-center gap-1.5 rounded-[10px] border border-pk-line bg-white px-4 py-2.5 text-sm font-medium text-pk-ink transition-colors hover:border-pk-slate/40";
const submitButton =
  "inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-6 py-3 text-[15px] font-medium text-white shadow-md ring-2 ring-pk-blue/30 ring-offset-2 ring-offset-pk-paper transition-colors hover:bg-pk-blue-deep";

type View = "intro" | "form" | "rejected";

/** Chromeless page container — the questionnaire renders without the app shell. */
function Page({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">{children}</div>;
}

export default function FindSupport() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("intro");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const questionRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleInList = (field: "services" | "funding", value: string) => {
    setForm((prev) => {
      const list = prev[field];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [field]: next };
    });
  };

  const scrollTop = () => window.scrollTo({ top: 0 });
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollToFirstError = (found: Errors) => {
    const firstKey = FORM_SECTIONS[step].items
      .flatMap((item) => (item.kind === "note" ? [] : [item.key]))
      .find((key) => found[key]);
    if (!firstKey) return;
    requestAnimationFrame(() => {
      const card = questionRefs.current[firstKey];
      card?.scrollIntoView({
        block: "center",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      card
        ?.querySelector<HTMLElement>("input, textarea, select, [role='radio'], [role='checkbox']")
        ?.focus({ preventScroll: true });
    });
  };

  const handleContinue = () => {
    const found = validateSection(step, form);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      scrollToFirstError(found);
      return;
    }
    if (step === 0 && SCREENING_KEYS.some((key) => form[key] === "No")) {
      setView("rejected");
      scrollTop();
      return;
    }
    if (step === FORM_SECTIONS.length - 1) {
      const services = form.services.filter((service): service is Service =>
        (SERVICES as readonly string[]).includes(service),
      );
      const servicesOther =
        form.servicesOtherChecked && form.servicesOther.trim() !== ""
          ? form.servicesOther.trim()
          : undefined;
      const heardAboutOther =
        form.heardAbout === "Other" && form.heardAboutOther.trim() !== ""
          ? form.heardAboutOther.trim()
          : undefined;
      const request = submitRequest({
        completedBy: form.completedBy,
        services,
        servicesOther,
        funding: form.funding,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        headline: form.headline.trim(),
        locality: form.locality,
        personSought: form.personSought.trim(),
        circumstances: form.circumstances.trim(),
        hasPets: form.pets !== "" && form.pets !== "No",
        petDetails: petDetailsHidden(form) ? "" : form.petDetails.trim(),
        schedule: form.schedule.trim(),
        consentWcnNetwork: form.consentWcn === "Yes",
        consentOtherNetworks: form.consentOther === "Yes",
        heardAbout: form.heardAbout,
        heardAboutOther,
        newsletter: form.newsletter === "Yes, please",
      });
      navigate(`/find-support/results/${request.id}`);
      return;
    }
    setErrors({});
    setStep(step + 1);
    scrollTop();
  };

  const handleBack = () => {
    setErrors({});
    if (step === 0) {
      setView("intro");
    } else {
      setStep(step - 1);
    }
    scrollTop();
  };

  const handleJump = (index: number) => {
    setErrors({});
    setStep(index);
    scrollTop();
  };

  const renderQuestion = (question: FormQuestion) => {
    const key = question.key;
    if (key === "petDetails" && petDetailsHidden(form)) return null;
    const error = errors[key];
    const labelId = `${key}-label`;
    const descriptionId = question.description ? `${key}-desc` : undefined;
    const errorId = error ? `${key}-error` : undefined;
    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
    const cardRef = (element: HTMLDivElement | null) => {
      questionRefs.current[key] = element;
    };

    if (question.kind === "radio") {
      const inline =
        question.options.length <= 4 &&
        question.options.every((option) => !option.isOther && option.label.length <= 16);
      return (
        <QuestionCard
          key={key}
          title={question.title}
          description={question.description}
          required={question.required}
          labelId={labelId}
          descriptionId={descriptionId}
          error={error}
          errorId={errorId}
          cardRef={cardRef}
        >
          <RadioOptions
            options={question.options}
            value={form[key] as string}
            onChange={(next) => set(key as "completedBy", next)}
            layout={inline ? "inline" : "stack"}
            labelledBy={labelId}
            describedBy={describedBy}
            required={question.required}
            invalid={Boolean(error)}
            otherValue={key === "heardAbout" ? form.heardAboutOther : undefined}
            onOtherChange={
              key === "heardAbout"
                ? (next) => {
                    set("heardAboutOther", next);
                    if (errors.heardAbout) {
                      setErrors((prev) => ({ ...prev, heardAbout: undefined }));
                    }
                  }
                : undefined
            }
          />
        </QuestionCard>
      );
    }

    if (question.kind === "checkboxes") {
      const single = question.options.length === 1;
      const checkedValues = single
        ? (form[key] as boolean)
          ? [question.options[0].label]
          : []
        : (form[key] as string[]);
      return (
        <QuestionCard
          key={key}
          title={question.title}
          description={question.description}
          required={question.required}
          labelId={labelId}
          descriptionId={descriptionId}
          error={error}
          errorId={errorId}
          cardRef={cardRef}
        >
          <CheckOptions
            options={question.options}
            values={checkedValues}
            onToggle={(label) => {
              if (single) {
                set(key as "disclaimerRead", !(form[key] as boolean));
              } else {
                toggleInList(key as "services" | "funding", label);
                if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
              }
            }}
            labelledBy={labelId}
            describedBy={describedBy}
            required={question.required}
            invalid={Boolean(error)}
            otherChecked={key === "services" ? form.servicesOtherChecked : undefined}
            onOtherToggle={
              key === "services"
                ? () => set("servicesOtherChecked", !form.servicesOtherChecked)
                : undefined
            }
            otherValue={key === "services" ? form.servicesOther : undefined}
            onOtherChange={key === "services" ? (next) => set("servicesOther", next) : undefined}
          />
        </QuestionCard>
      );
    }

    if (question.kind !== "short" && question.kind !== "paragraph") return null;

    // Text questions. The town/village question keeps the demo's locality
    // <select> (Results matching depends on known localities) with the
    // form's verbatim label and description.
    if (key === "locality") {
      return (
        <QuestionCard
          key={key}
          title={question.title}
          description={question.description}
          required={question.required}
          htmlFor={key}
          descriptionId={descriptionId}
          error={error}
          errorId={errorId}
          cardRef={cardRef}
        >
          <select
            id={key}
            value={form.locality}
            onChange={(event) => set("locality", event.target.value)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describedBy}
            className={`${textFieldClass} ${error ? "border-pk-clay/60" : "border-pk-line"}`}
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
        </QuestionCard>
      );
    }

    return (
      <QuestionCard
        key={key}
        title={question.title}
        description={question.description}
        required={question.required}
        htmlFor={key}
        descriptionId={descriptionId}
        error={error}
        errorId={errorId}
        cardRef={cardRef}
      >
        <TextField
          id={key}
          kind={question.kind === "paragraph" ? "textarea" : "input"}
          type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
          rows={TEXTAREA_ROWS[key] ?? 3}
          value={form[key] as string}
          onChange={(next) => set(key as "name", next)}
          maxLength={question.maxLength}
          showCounter={question.maxLength !== undefined}
          autoComplete={AUTOCOMPLETE[key]}
          invalid={Boolean(error)}
          describedBy={describedBy}
        />
      </QuestionCard>
    );
  };

  const renderItem = (item: FormItem, index: number) => {
    if (item.kind === "note") {
      return (
        <div
          key={`note-${index}`}
          className="rounded-xl border border-pk-line bg-pk-sand p-4 text-sm leading-relaxed text-pk-slate sm:p-5"
        >
          <p className="font-medium text-pk-ink">{item.title}</p>
          {item.description && (
            <FormattedText text={item.description} className="mt-1 space-y-1" />
          )}
        </div>
      );
    }
    return renderQuestion(item);
  };

  if (view === "intro") {
    return (
      <Page>
        <div className="max-w-xl animate-rise">
          <img
            src={wcnLogo}
            alt="Wells Community Network — Working Together, Supporting Each Other"
            className="h-24 w-auto"
          />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance">
            {FORM_META.title}
          </h1>
          <FormattedText
            text={FORM_META.description}
            className="mt-5 space-y-3 text-[15px] leading-relaxed text-pk-slate"
          />
          <div className="mt-8 flex items-center gap-4">
            <button type="button" onClick={() => setView("form")} className={primaryButton}>
              Start <ArrowRight size={15} aria-hidden />
            </button>
            <Link to="/" className="text-sm text-pk-slate hover:text-pk-ink">
              Cancel
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  if (view === "rejected") {
    return (
      <Page>
        <div className="max-w-xl animate-rise">
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance">
            {FORM_META.rejection.title}
          </h1>
          <FormattedText
            text={FORM_META.rejection.description}
            className="mt-5 space-y-3 text-[15px] leading-relaxed text-pk-slate"
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setView("form");
                setForm((prev) => ({
                  ...prev,
                  confirmConsent: "",
                  confirmAssess: "",
                  confirmCoordinate: "",
                  confirmCommunicate: "",
                }));
              }}
              className={primaryButton}
            >
              <RotateCcw size={15} aria-hidden /> Start again
            </button>
            <Link to="/" className={outlineButton}>
              Back to home
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  const section = FORM_SECTIONS[step];
  const { answered, total } = countProgress(form);
  const isLast = step === FORM_SECTIONS.length - 1;

  return (
    <Page>
      <div key={section.id} className="animate-rise">
        <SectionHeader
          sections={FORM_SECTIONS}
          currentIndex={step}
          onJump={handleJump}
          title={section.title}
          answered={answered}
          total={total}
        />
        {section.description && (
          <FormattedText
            text={section.description}
            className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-pk-slate"
          />
        )}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
        >
          <div className="mt-6 space-y-4">{section.items.map(renderItem)}</div>
          <div className="mt-9 flex items-center justify-between gap-3 border-t border-pk-line pt-5">
            <button type="button" onClick={handleBack} className={outlineButton}>
              <ArrowLeft size={15} aria-hidden /> Back
            </button>
            <button type="submit" className={isLast ? submitButton : primaryButton}>
              {isLast ? "Submit request" : "Continue"}
              <ArrowRight size={15} aria-hidden />
            </button>
          </div>
        </form>
      </div>
    </Page>
  );
}
