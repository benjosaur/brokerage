type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

/**
 * Renders verbatim multi-line form text: each line becomes a paragraph and
 * consecutive `- ` lines group into a bullet list. Wording is untouched;
 * only the layout is interpreted.
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  const blocks: Block[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      const item = trimmed.slice(2);
      if (last?.kind === "ul") last.items.push(item);
      else blocks.push({ kind: "ul", items: [item] });
    } else {
      blocks.push({ kind: "p", text: trimmed });
    }
  }
  return (
    <div className={className}>
      {blocks.map((block, index) =>
        block.kind === "p" ? (
          <p key={index}>{block.text}</p>
        ) : (
          <ul key={index} className="list-disc space-y-0.5 pl-5">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

interface QuestionCardProps {
  /** Verbatim question title; first line is the label, the rest is support copy. */
  title: string;
  /** Verbatim question description (help text). */
  description?: string;
  required?: boolean;
  /** Set for text controls to get a real <label>… */
  htmlFor?: string;
  /** …or set for grouped controls labelled via aria-labelledby. */
  labelId?: string;
  descriptionId?: string;
  error?: string;
  errorId?: string;
  cardRef?: (element: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

const secondaryText = "mt-1.5 space-y-1.5 text-sm leading-relaxed text-pk-slate";

/** Soft question card in the ADHDX visual language, on Paddock tokens. */
export function QuestionCard({
  title,
  description,
  required,
  htmlFor,
  labelId,
  descriptionId,
  error,
  errorId,
  cardRef,
  children,
}: QuestionCardProps) {
  const [label, ...supportLines] = title.split("\n");
  const supporting = supportLines.join("\n");
  const mark = required ? (
    <>
      <span aria-hidden className="ml-1 text-pk-clay">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  ) : null;

  return (
    <div
      ref={cardRef}
      className={`rounded-xl border bg-white/60 p-4 transition-colors sm:p-5 ${
        error ? "border-pk-clay/50" : "border-pk-line"
      }`}
    >
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-lg leading-snug font-medium text-pk-ink">
          {label}
          {mark}
        </label>
      ) : (
        <p id={labelId} className="text-lg leading-snug font-medium text-pk-ink">
          {label}
          {mark}
        </p>
      )}
      {supporting && <FormattedText text={supporting} className={secondaryText} />}
      {description && (
        <div id={descriptionId}>
          <FormattedText text={description} className={secondaryText} />
        </div>
      )}
      <div className="mt-3.5">{children}</div>
      {error && (
        <p id={errorId} role="alert" className="mt-2.5 text-[13px] font-medium text-pk-clay">
          {error}
        </p>
      )}
    </div>
  );
}
