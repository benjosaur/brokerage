#!/usr/bin/env bun
/**
 * Sync the Find Support questionnaire content with the live Google Form.
 *
 *   bun scripts/sync-form-content.ts --write            regenerate src/lib/formContent.ts
 *   bun scripts/sync-form-content.ts --check            verify the repo matches the live form (exit 1 on drift)
 *   bun scripts/sync-form-content.ts --check --from f   use a saved FB_PUBLIC_LOAD_DATA_ JSON payload (offline)
 *
 * Wording policy: strings are byte-exact apart from normalize() — per-line
 * trailing whitespace and outer blank space are trimmed, nothing else. Typos,
 * double spaces, en dashes and curly quotes in the live form are significant.
 *
 * Runs under bun only; this file sits outside the tsc projects on purpose.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfWRp9OXEbfmIJtW4E_nEYwkXVUts0sfFxtkvhVOtSbCBTuFw/viewform";
const OUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "formContent.ts",
);

// ---------------------------------------------------------------- app map

// FormState key per Google entry ID. An unmapped entry ID in the live payload
// means the form changed shape — hard error rather than silent drift.
const FIELD_BY_ENTRY: Record<number, string> = {
  1081703792: "completedBy",
  603369162: "confirmConsent",
  2043666850: "confirmAssess",
  210863801: "confirmCoordinate",
  1788010623: "confirmCommunicate",
  1895565538: "services",
  532904551: "funding",
  1029857308: "name",
  30066852: "email",
  284650542: "phone",
  1791923969: "headline",
  17717468: "locality",
  948387899: "personSought",
  1922750044: "circumstances",
  2021225176: "pets",
  1474972490: "petDetails",
  1679165166: "schedule",
  311722699: "consentWcn",
  1600711344: "consentOther",
  1423090436: "heardAbout",
  577778576: "newsletter",
  1550210671: "disclaimerRead",
  86681631: "accurateInfo",
};

// Wizard section per Google section-item ID, with the short pill label shown
// in the step header (app chrome — the verbatim title is the page heading).
const SECTION_BY_ITEM: Record<number, { id: string; pillLabel: string }> = {
  697967720: { id: "screening", pillLabel: "Screening" },
  1893235879: { id: "needs", pillLabel: "Your needs" },
  253672116: { id: "about", pillLabel: "About you" },
  739232380: { id: "consent", pillLabel: "Consent" },
  642175089: { id: "touch", pillLabel: "Staying in touch" },
  1144074968: { id: "disclaimer", pillLabel: "Disclaimer" },
};
const CONFIRMATION_ITEM = 5985947; // trailing "Thank you for applying…" section
const REJECTION_ITEM = 940791773; // branch target when a screening answer is "No"

// App-side field metadata the payload does not encode.
const MAX_LENGTH: Record<string, number> = { headline: 255 };

// Question keys whose option labels are guarded at compile time against the
// canonical arrays in src/lib/types.ts (used by matching/badges/seed).
const DRIFT_GUARDS: Record<string, string> = {
  services: "SERVICES",
  funding: "FUNDING_OPTIONS",
  completedBy: "COMPLETED_BY_OPTIONS",
  heardAbout: "HEARD_ABOUT_OPTIONS",
};

// ------------------------------------------------------------- overrides

// Deliberate rewrites for the app's automatching pipeline (results appear
// instantly instead of WCN processing requests by hand). Each override is
// pinned to the exact upstream text it replaces: `find` must occur exactly
// once in the target's normalized live text or generation hard-errors, so
// an upstream edit by WCN forces a review here instead of being silently
// overridden. Everything not listed stays byte-exact from the live form.
type OverrideTarget =
  | { type: "meta"; field: "description" | "confirmationMessage" }
  | { type: "section"; id: string; field: "description" }
  | { type: "question"; entryId: number; field: "title" | "description" };

interface Override {
  label: string;
  target: OverrideTarget;
  find: string;
  replace: string;
}

const OVERRIDES: Override[] = [
  {
    label: "intro — matches are shown instantly, WCN no longer calls back",
    target: { type: "meta", field: "description" },
    find: "When you fill in this form we will share your details with Wells Community Network approved Micro-providers near you. We will then contact you with details of all the Micro-providers who are available to support you, leaving you to choose the right support for you.",
    replace:
      "After you fill in this form you will see a list of Microproviders that fit your needs, approved by Wells Community Network. You then can choose who to follow up with using their email.",
  },
  {
    label: "email help — the mail-merge step is gone",
    target: { type: "question", entryId: 30066852, field: "description" },
    find: "*Please make sure your email is accurate, so we can contact you with local care options. Only enter an actual email address within this field, do not type any other text, for example, (this is my work email)\nTyping anything other than just an email address will cause the brokerage tool to fail and your care request will be unsuccessful.",
    replace:
      "*Please make sure your email is accurate, as we may need to follow up based on your request.",
  },
  {
    label: "headline — forwarding note precedes the ask",
    target: { type: "question", entryId: 1791923969, field: "title" },
    find: "Give your request for support a headline",
    replace:
      "We may forward your enquiry to other networks. To aid us in this give your request for support a headline",
  },
  {
    label: "consent intro — sharing happens when forwarding to other networks",
    target: { type: "section", id: "consent", field: "description" },
    find: "To help us identify suitable micro-providers, we may need to share some",
    replace:
      "We may forward your enquiry to other microprovider networks. As part of this we may need to share some",
  },
  {
    label: "confirmation — matches are instant, keep only the enquiries line",
    target: { type: "meta", field: "confirmationMessage" },
    find: "Thank you for applying for support, we will process your request within three working days.   If you have any other enquiries please contact the WCN Helpline 01749 467079",
    replace:
      "If you have any other enquiries please contact the WCN Helpline 01749 467079",
  },
];

// ------------------------------------------------------------------ parse

// FB_PUBLIC_LOAD_DATA_ shapes (reverse-engineered, stable for years):
//   payload[3]                form title;  payload[1][0] form description
//   payload[1][1]             items: [id, title, description, typeCode, entries?]
//   typeCode                  8 section, 6 display note, 0 short, 1 paragraph,
//                             2 radio, 4 checkboxes
//   entries[0]                [entryId, options|null, requiredFlag, ...]
//   option                    [label, ..., ..., ..., isOtherFlag]
/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = any;

function normalize(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

interface ParsedOption {
  label: string;
  isOther?: true;
}

interface ParsedItem {
  kind: "note" | "short" | "paragraph" | "radio" | "checkboxes";
  key?: string;
  entryId?: number;
  title: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
  options?: ParsedOption[];
}

interface ParsedSection {
  id: string;
  pillLabel: string;
  title: string;
  description?: string;
  items: ParsedItem[];
}

interface ParsedForm {
  meta: {
    title: string;
    description: string;
    confirmationMessage: string;
    rejection: { title: string; description: string };
  };
  sections: ParsedSection[];
}

const KIND_BY_TYPE: Record<number, "short" | "paragraph" | "radio" | "checkboxes"> = {
  0: "short",
  1: "paragraph",
  2: "radio",
  4: "checkboxes",
};

function parseForm(payload: Raw): ParsedForm {
  const items: Raw[] = payload[1][1];
  const sections: ParsedSection[] = [];
  let confirmationMessage = "";
  let rejection: { title: string; description: string } | undefined;
  let current: ParsedSection | undefined;

  for (const item of items) {
    const itemId: number = item[0];
    const title = normalize(item[1] ?? "");
    const description = item[2] ? normalize(item[2]) : undefined;
    const typeCode: number = item[3];

    if (typeCode === 8) {
      // Section break. Two trailing sections are special pages, not steps.
      if (itemId === CONFIRMATION_ITEM) {
        confirmationMessage = title;
        current = undefined;
        continue;
      }
      if (itemId === REJECTION_ITEM) {
        rejection = { title, description: description ?? "" };
        current = undefined;
        continue;
      }
      const config = SECTION_BY_ITEM[itemId];
      if (!config) {
        throw new Error(`Unmapped section item ${itemId} ("${title}") — the live form changed.`);
      }
      current = { ...config, title, description, items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      throw new Error(`Item ${itemId} ("${title}") is outside every mapped section.`);
    }

    if (typeCode === 6) {
      current.items.push({ kind: "note", title, description });
      continue;
    }

    const kind = KIND_BY_TYPE[typeCode];
    if (!kind) {
      throw new Error(`Unsupported item type ${typeCode} for item ${itemId} ("${title}").`);
    }
    const entry = item[4]?.[0];
    if (!entry) {
      throw new Error(`Item ${itemId} ("${title}") has no answer entry.`);
    }
    const entryId: number = entry[0];
    const key = FIELD_BY_ENTRY[entryId];
    if (!key) {
      throw new Error(`Unmapped entry ${entryId} ("${title}") — the live form changed.`);
    }

    const parsed: ParsedItem = {
      kind,
      key,
      entryId,
      title,
      description,
      required: entry[2] === 1,
      maxLength: MAX_LENGTH[key],
    };
    if (kind === "radio" || kind === "checkboxes") {
      parsed.options = (entry[1] as Raw[]).map((option) =>
        option[4] === 1
          ? { label: normalize(option[0]), isOther: true as const }
          : { label: normalize(option[0]) },
      );
    }
    current.items.push(parsed);
  }

  if (!confirmationMessage) throw new Error("Confirmation section not found in the live form.");
  if (!rejection) throw new Error("Rejection section not found in the live form.");
  const seen = new Set(sections.flatMap((s) => s.items.map((i) => i.entryId)));
  const missing = Object.keys(FIELD_BY_ENTRY)
    .map(Number)
    .filter((id) => !seen.has(id));
  if (missing.length > 0) {
    throw new Error(`Mapped entries missing from the live form: ${missing.join(", ")}`);
  }

  return {
    meta: {
      title: normalize(payload[3] ?? ""),
      description: normalize(payload[1][0] ?? ""),
      confirmationMessage,
      rejection,
    },
    sections,
  };
}

function readTarget(form: ParsedForm, target: OverrideTarget): string | undefined {
  if (target.type === "meta") return form.meta[target.field];
  if (target.type === "section") {
    return form.sections.find((section) => section.id === target.id)?.[target.field];
  }
  return form.sections
    .flatMap((section) => section.items)
    .find((item) => item.entryId === target.entryId)?.[target.field];
}

function writeTarget(form: ParsedForm, target: OverrideTarget, value: string): void {
  if (target.type === "meta") {
    form.meta[target.field] = value;
    return;
  }
  if (target.type === "section") {
    const section = form.sections.find((entry) => entry.id === target.id);
    if (section) section[target.field] = value;
    return;
  }
  const question = form.sections
    .flatMap((section) => section.items)
    .find((item) => item.entryId === target.entryId);
  if (question) question[target.field] = value;
}

function applyOverrides(form: ParsedForm): void {
  for (const override of OVERRIDES) {
    const current = readTarget(form, override.target);
    if (current === undefined) {
      throw new Error(`Override "${override.label}": target not found in the live form.`);
    }
    const parts = current.split(override.find);
    if (parts.length !== 2) {
      throw new Error(
        `Override "${override.label}": the pinned upstream text no longer occurs exactly once — the live form changed; re-review this override.`,
      );
    }
    writeTarget(form, override.target, parts.join(override.replace));
  }
}

// ------------------------------------------------------------------- emit

function lit(value: unknown, indent: string): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const inner = indent + "  ";
    return `[\n${value.map((v) => inner + lit(v, inner)).join(",\n")},\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    const inner = indent + "  ";
    return `{\n${entries
      .map(([k, v]) => `${inner}${k}: ${lit(v, inner)}`)
      .join(",\n")},\n${indent}}`;
  }
  throw new Error(`Cannot serialize value: ${String(value)}`);
}

function generate(form: ParsedForm): string {
  const fieldKeys = form.sections.flatMap((section) =>
    section.items.flatMap((item) => (item.key ? [item.key] : [])),
  );
  const guards = Object.entries(DRIFT_GUARDS).map(([key, constName]) => {
    const question = form.sections
      .flatMap((section) => section.items)
      .find((item) => item.key === key);
    if (!question?.options) throw new Error(`Drift guard "${key}" is not a choice question.`);
    const labels = question.options.filter((o) => !o.isOther).map((o) => o.label);
    return `  ${key}: [${labels.map((l) => JSON.stringify(l)).join(", ")}] as const satisfies typeof ${constName},`;
  });

  return `// Generated by scripts/sync-form-content.ts — DO NOT EDIT.
// Content of the live "Support Near You" Google Form:
// ${FORM_URL}
// Regenerate with \`bun run form:sync\`; verify with \`bun run form:check\`.
// Strings are byte-exact apart from trimmed trailing/outer whitespace — the
// typos, double spaces, en dashes and curly quotes are the form's own —
// except ${OVERRIDES.length} passages deliberately rewritten for the automatching
// pipeline; see OVERRIDES in the sync script.
import type {
  COMPLETED_BY_OPTIONS,
  FUNDING_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  SERVICES,
} from "./types";

export type FieldKey =
${fieldKeys.map((key) => `  | "${key}"`).join("\n")};

export interface FormOption {
  readonly label: string;
  readonly isOther?: true;
}

export interface NoteItem {
  readonly kind: "note";
  readonly title: string;
  readonly description?: string;
}

export interface TextQuestion {
  readonly kind: "short" | "paragraph";
  readonly key: FieldKey;
  readonly entryId: number;
  readonly title: string;
  readonly description?: string;
  readonly required: boolean;
  readonly maxLength?: number;
}

export interface ChoiceQuestion {
  readonly kind: "radio" | "checkboxes";
  readonly key: FieldKey;
  readonly entryId: number;
  readonly title: string;
  readonly description?: string;
  readonly required: boolean;
  readonly options: readonly FormOption[];
}

export type FormQuestion = TextQuestion | ChoiceQuestion;
export type FormItem = NoteItem | FormQuestion;

export type SectionId = ${form.sections.map((s) => JSON.stringify(s.id)).join(" | ")};

export interface FormSection {
  readonly id: SectionId;
  readonly pillLabel: string;
  readonly title: string;
  readonly description?: string;
  readonly items: readonly FormItem[];
}

export interface FormMeta {
  readonly title: string;
  readonly description: string;
  readonly confirmationMessage: string;
  readonly rejection: { readonly title: string; readonly description: string };
}

export const FORM_META: FormMeta = ${lit(form.meta, "")};

export const FORM_SECTIONS: readonly FormSection[] = ${lit(form.sections, "")};

/** Compile-time drift guards: the build fails if the live form's option
 *  labels stop matching the canonical arrays in ./types. */
export const OPTION_DRIFT_GUARDS = {
${guards.join("\n")}
};
`;
}

// ------------------------------------------------------------------- main

async function loadPayload(fromFile?: string): Promise<Raw> {
  if (fromFile) return JSON.parse(readFileSync(fromFile, "utf8"));
  const response = await fetch(FORM_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`Fetching the form failed: HTTP ${response.status}`);
  const html = await response.text();
  const marker = "FB_PUBLIC_LOAD_DATA_ = ";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("FB_PUBLIC_LOAD_DATA_ not found in the form page.");
  const end = html.indexOf("</script>", start);
  if (end === -1) throw new Error("Unterminated FB_PUBLIC_LOAD_DATA_ script block.");
  const raw = html
    .slice(start + marker.length, end)
    .trim()
    .replace(/;$/, "");
  return JSON.parse(raw);
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const check = args.includes("--check");
  const fromIndex = args.indexOf("--from");
  const fromFile = fromIndex === -1 ? undefined : args[fromIndex + 1];
  if (write === check) {
    console.error("Usage: bun scripts/sync-form-content.ts --write | --check [--from payload.json]");
    process.exit(2);
  }

  const form = parseForm(await loadPayload(fromFile));
  applyOverrides(form);
  const generated = generate(form);

  if (write) {
    writeFileSync(OUT_PATH, generated);
    console.log(`Wrote ${OUT_PATH}`);
    return;
  }

  const existing = readFileSync(OUT_PATH, "utf8");
  if (existing === generated) {
    console.log(
      `formContent.ts matches the live form (${OVERRIDES.length} documented overrides applied).`,
    );
    return;
  }
  const expected = generated.split("\n");
  const actual = existing.split("\n");
  let shown = 0;
  for (let i = 0; i < Math.max(expected.length, actual.length) && shown < 20; i++) {
    if (expected[i] !== actual[i]) {
      console.error(`line ${i + 1}:`);
      console.error(`  live form: ${expected[i] ?? "<missing>"}`);
      console.error(`  in repo:   ${actual[i] ?? "<missing>"}`);
      shown++;
    }
  }
  console.error(`\nformContent.ts is out of sync with the live form. Run \`bun run form:sync\`.`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
