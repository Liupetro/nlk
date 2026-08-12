"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type MaterialOption = { id: string; label: string };

type MaterialSelectProps = {
  options: MaterialOption[];
  value: string;
  placeholder: string;
  onChange: (id: string) => void;
  required?: boolean;
  /** Native select name for form FormData */
  name?: string;
  className?: string;
  /** Tighter padding for dense forms (e.g. contact) */
  compact?: boolean;
};

/**
 * Dark branded material grade dropdown — shared by quote form and contact form.
 */
export function MaterialSelect({
  options,
  value,
  placeholder,
  onChange,
  required,
  name = "material",
  className,
  compact = false,
}: MaterialSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <select
        className="sr-only"
        tabIndex={-1}
        required={required}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-hidden
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border text-left text-sm font-medium transition-all duration-200",
          compact ? "px-3 py-2" : "px-4 py-3 lg:py-2.5",
          "bg-white/[0.04] hover:bg-white/[0.06]",
          open || selected
            ? "border-accent/50 text-white shadow-[0_0_0_1px_rgba(0,180,216,0.2)]"
            : "border-white/12 text-white/45",
          selected && "text-white",
        )}
      >
        <span className={cn(selected ? "text-white" : "text-white/45")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-accent-bright transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0f1419] py-1.5 shadow-2xl shadow-black/50"
          >
            {options.map((opt) => {
              const active = value === opt.id;
              return (
                <li key={opt.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-accent/20 text-accent-bright"
                        : "text-white hover:bg-accent/20 hover:text-accent-bright",
                    )}
                  >
                    <span>{opt.label}</span>
                    {active && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
