import { fieldLabel, inputEl } from "./tableStyles";
import { SERVICES, type Service } from "../lib/types";

// Field building blocks matching Paddock's form markup
// (pages/MpForm.tsx): label + input pairs inside a space-y-4 column.

interface BaseFieldProps {
  id: string;
  label: string;
  required?: boolean;
}

function FieldLabel({ id, label, required }: BaseFieldProps) {
  return (
    <label htmlFor={id} className={fieldLabel}>
      {label}
      {required ? " *" : ""}
    </label>
  );
}

export function TextField({
  id,
  label,
  required,
  type = "text",
  value,
  onChange,
}: BaseFieldProps & {
  type?: "text" | "date" | "tel" | "email";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputEl}
      />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  value,
  onChange,
}: BaseFieldProps & { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <textarea
        id={id}
        value={value}
        required={required}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputEl} h-auto`}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  value,
  options,
  placeholder,
  onChange,
}: BaseFieldProps & {
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <select
        id={id}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputEl}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 shrink-0 accent-blue-600"
      />
      {label}
    </label>
  );
}

export function CheckboxGroupField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (option: string, checked: boolean) => {
    onChange(
      checked ? [...value, option] : value.filter((entry) => entry !== option),
    );
  };

  return (
    <div>
      <span className={fieldLabel}>{label}</span>
      <div className="space-y-2">
        {options.map((option) => (
          <CheckboxField
            key={option}
            id={`${label}-${option}`}
            label={option}
            checked={value.includes(option)}
            onChange={(checked) => toggle(option, checked)}
          />
        ))}
      </div>
    </div>
  );
}

export function ServicesField({
  value,
  onChange,
}: {
  value: Service[];
  onChange: (services: Service[]) => void;
}) {
  return (
    <CheckboxGroupField
      label="Services"
      options={SERVICES}
      value={value}
      onChange={(next) => onChange(next as Service[])}
    />
  );
}
