import { useEffect, useRef } from "react";

interface SectionHeaderProps {
  sections: readonly { id: string; pillLabel: string }[];
  currentIndex: number;
  /** Jump back to an earlier (completed) section. */
  onJump: (index: number) => void;
  /** Verbatim section title from the form. */
  title: string;
  answered: number;
  total: number;
}

/**
 * Sticky wizard header: tri-state section pills, a thin overall progress bar
 * and the section title. The title takes focus on section change so screen
 * readers announce where the user landed.
 */
export default function SectionHeader({
  sections,
  currentIndex,
  onJump,
  title,
  answered,
  total,
}: SectionHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentIndex]);

  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-pk-line bg-pk-paper/95 px-4 pt-4 pb-3 backdrop-blur">
      <nav aria-label="Form sections" className="flex flex-wrap gap-1.5">
        {sections.map((section, index) => {
          const state =
            index === currentIndex ? "current" : index < currentIndex ? "done" : "todo";
          return (
            <button
              key={section.id}
              type="button"
              disabled={state === "todo"}
              aria-current={state === "current" ? "step" : undefined}
              onClick={() => state === "done" && onJump(index)}
              className={`grow rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                state === "current"
                  ? "bg-pk-blue text-white"
                  : state === "done"
                    ? "cursor-pointer bg-pk-blue-soft text-pk-blue-deep hover:bg-pk-blue/15"
                    : "bg-pk-fog text-pk-slate"
              }`}
            >
              {section.pillLabel}
            </button>
          );
        })}
      </nav>
      <div
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        className="mt-3 h-1 overflow-hidden rounded-full bg-pk-fog"
      >
        <div
          className="h-1 rounded-full bg-pk-blue transition-all"
          style={{ width: `${total === 0 ? 0 : (answered / total) * 100}%` }}
        />
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-display text-2xl font-bold tracking-tight text-balance outline-none"
      >
        {title}
      </h1>
      <p className="mt-1 font-plex text-[11px] text-pk-slate">
        Section {currentIndex + 1} of {sections.length} · {answered} of {total} answered
      </p>
    </div>
  );
}
