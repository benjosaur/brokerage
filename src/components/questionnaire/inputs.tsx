import { Check } from "lucide-react";
import { useRef } from "react";
import type { FormOption } from "../../lib/formContent";

export const textFieldClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-pk-ink placeholder:text-pk-slate/50";

const fieldBorder = (invalid?: boolean) => (invalid ? "border-pk-clay/60" : "border-pk-line");

/** The signature ADHDX control: a circular dot that fills with a check. */
function Dot({ selected, square }: { selected: boolean; square?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-px flex size-6 shrink-0 items-center justify-center border-2 transition-colors ${
        square ? "rounded-md" : "rounded-full"
      } ${
        selected
          ? "border-pk-blue bg-pk-blue text-white"
          : "border-pk-line bg-white group-hover:border-pk-blue/50"
      }`}
    >
      {selected && <Check size={14} strokeWidth={3} aria-hidden />}
    </span>
  );
}

function OtherInput({
  value,
  onChange,
  onActivate,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  onActivate: () => void;
  invalid?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => {
        onActivate();
        onChange(event.target.value);
      }}
      onFocus={onActivate}
      aria-label="Other — please specify"
      className={`${textFieldClass} ${fieldBorder(invalid)} max-w-xs min-w-40 flex-1`}
    />
  );
}

const optionLabelClass = (selected: boolean) =>
  `text-[15px] leading-snug font-medium transition-colors ${
    selected ? "text-pk-blue-deep" : "text-pk-ink"
  }`;

interface RadioOptionsProps {
  options: readonly FormOption[];
  /** Selected verbatim option label, or "Other" for the free-text option. */
  value: string;
  onChange: (next: string) => void;
  layout?: "inline" | "stack";
  labelledBy: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  otherValue?: string;
  onOtherChange?: (next: string) => void;
}

/** Custom radio group with roving tabindex and arrow-key selection. */
export function RadioOptions({
  options,
  value,
  onChange,
  layout = "inline",
  labelledBy,
  describedBy,
  required,
  invalid,
  otherValue,
  onOtherChange,
}: RadioOptionsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const values = options.map((option) => (option.isOther ? "Other" : option.label));
  const selectedIndex = values.indexOf(value);

  const moveTo = (index: number) => {
    onChange(values[index]);
    refs.current[index]?.focus();
  };
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveTo((index + 1) % options.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo((index - 1 + options.length) % options.length);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      className={layout === "inline" ? "flex flex-wrap gap-x-6 gap-y-2.5" : "space-y-2.5"}
    >
      {options.map((option, index) => {
        const optionValue = values[index];
        const selected = value === optionValue;
        const radio = (
          <button
            key={optionValue}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selectedIndex === -1 ? (index === 0 ? 0 : -1) : selected ? 0 : -1}
            onClick={() => onChange(optionValue)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="group flex cursor-pointer items-start gap-3 text-left"
          >
            <Dot selected={selected} />
            <span className={optionLabelClass(selected)}>
              {option.isOther ? "Other:" : option.label}
            </span>
          </button>
        );
        if (!option.isOther) return radio;
        return (
          <div key={optionValue} className="flex w-full flex-wrap items-center gap-3">
            {radio}
            <OtherInput
              value={otherValue ?? ""}
              onChange={(next) => onOtherChange?.(next)}
              onActivate={() => {
                if (!selected) onChange(optionValue);
              }}
              invalid={invalid}
            />
          </div>
        );
      })}
    </div>
  );
}

interface CheckOptionsProps {
  options: readonly FormOption[];
  /** Checked verbatim option labels. */
  values: readonly string[];
  onToggle: (label: string) => void;
  labelledBy: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  otherChecked?: boolean;
  onOtherToggle?: () => void;
  otherValue?: string;
  onOtherChange?: (next: string) => void;
}

/** Checkbox group sharing the dot visual language (square variant). */
export function CheckOptions({
  options,
  values,
  onToggle,
  labelledBy,
  describedBy,
  required,
  invalid,
  otherChecked = false,
  onOtherToggle,
  otherValue,
  onOtherChange,
}: CheckOptionsProps) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="space-y-2.5"
    >
      {options.map((option) => {
        const checked = option.isOther ? otherChecked : values.includes(option.label);
        const checkbox = (
          <button
            key={option.isOther ? "Other" : option.label}
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            onClick={() => (option.isOther ? onOtherToggle?.() : onToggle(option.label))}
            className="group flex cursor-pointer items-start gap-3 text-left"
          >
            <Dot selected={checked} square />
            <span className={optionLabelClass(checked)}>
              {option.isOther ? "Other:" : option.label}
            </span>
          </button>
        );
        if (!option.isOther) return checkbox;
        return (
          <div key="Other" className="flex w-full flex-wrap items-center gap-3">
            {checkbox}
            <OtherInput
              value={otherValue ?? ""}
              onChange={(next) => onOtherChange?.(next)}
              onActivate={() => {
                if (!otherChecked) onOtherToggle?.();
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  kind?: "input" | "textarea";
  type?: string;
  rows?: number;
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  showCounter?: boolean;
  autoComplete?: string;
  invalid?: boolean;
  describedBy?: string;
}

export function TextField({
  id,
  kind = "input",
  type = "text",
  rows = 3,
  value,
  onChange,
  maxLength,
  showCounter,
  autoComplete,
  invalid,
  describedBy,
}: TextFieldProps) {
  const shared = {
    id,
    value,
    maxLength,
    autoComplete,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    className: `${textFieldClass} ${fieldBorder(invalid)}`,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };
  return (
    <>
      {kind === "textarea" ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}
      {showCounter && maxLength !== undefined && (
        <p className="mt-1 text-right font-plex text-[11px] text-pk-slate">
          {value.length}/{maxLength}
        </p>
      )}
    </>
  );
}
