"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileUp,
  X,
} from "lucide-react";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MaterialSelect } from "@/components/ui/MaterialSelect";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { sendLeadClient } from "@/lib/clientSubmit";

type FormState = {
  material: string;
  volume: string;
  scope: string;
  company: string;
  phone: string;
  email: string;
};

const initial: FormState = {
  material: "",
  volume: "v10k",
  scope: "machined",
  company: "",
  phone: "",
  email: "",
};

const ACCEPTED_EXT = [".pdf", ".stp", ".step", ".jpg", ".jpeg", ".png"] as const;
const ACCEPT_ATTR = ACCEPTED_EXT.join(",");
const MAX_FILE_BYTES = 15 * 1024 * 1024;

function isAllowedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXT.some((ext) => lower.endsWith(ext));
}

export function ProjectEstimator() {
  const { estimator } = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(initial);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedCompany, setSubmittedCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSelectedFile = useCallback(
    (next: File | null) => {
      setFileError(null);
      if (!next) {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (!isAllowedFile(next)) {
        setFile(null);
        setFileError(estimator.fileErrorType);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (next.size > MAX_FILE_BYTES) {
        setFile(null);
        setFileError(estimator.fileErrorSize);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(next);
    },
    [estimator.fileErrorType, estimator.fileErrorSize],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    if (!form.material) {
      setError(estimator.errorMessage);
      return;
    }

    const materialLabel =
      estimator.materials.find((m) => m.id === form.material)?.label ??
      form.material;
    const volumeLabel =
      estimator.volumes.find((v) => v.id === form.volume)?.label ?? form.volume;
    const scopeLabel =
      estimator.scopes.find((s) => s.id === form.scope)?.label ?? form.scope;

    const data = new FormData();
    data.set("name", form.company);
    data.set("company", form.company);
    data.set("phone", form.phone);
    data.set("email", form.email);
    data.set("material", form.material);
    data.set("materialLabel", materialLabel);
    data.set("volume", form.volume);
    data.set("volumeLabel", volumeLabel);
    data.set("scope", form.scope);
    data.set("scopeLabel", scopeLabel);
    data.set(
      "message",
      [
        "Р—Р°СЏРІРєР° РЅР° СЂР°СЃС‡С‘С‚ СЃ СЃР°Р№С‚Р° (/process)",
        `РњР°С‚РµСЂРёР°Р»: ${materialLabel}`,
        `Р“РѕРґРѕРІРѕР№ РѕР±СЉС‘Рј: ${volumeLabel}`,
        `Р§С‚Рѕ РЅСѓР¶РЅРѕ: ${scopeLabel}`,
      ].join("\n"),
    );
    data.set("source", "estimator");

    if (file) {
      data.set("file", file);
    }

    setSubmitting(true);
    try {
      await sendLeadClient(data, {
        source: "estimator",
        subjectName: form.company,
      });
      setSubmittedCompany(form.company);
      setSubmitted(true);
      setForm(initial);
      setSelectedFile(null);
    } catch {
      setError(estimator.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const successText = estimator.successMessage.replace(
    "{company}",
    submittedCompany ? `, ${submittedCompany}` : "",
  );

  return (
    <section
      id="estimator"
      className="relative py-16 lg:py-20 bg-dark-section bg-noise overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-40" aria-hidden />
      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5">
            <SectionHeading
              theme="dark"
              eyebrow={estimator.eyebrow}
              number={estimator.number}
              title={estimator.title}
              accent={estimator.accent}
              description={estimator.subtitle}
            />
          </div>

          <Reveal delay={0.08} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 lg:p-6 shadow-2xl shadow-black/30"
            >
              <Fieldset label={estimator.materialsLabel}>
                <MaterialSelect
                  options={estimator.materials}
                  value={form.material}
                  placeholder={estimator.materialsPlaceholder}
                  onChange={(v) => set("material", v)}
                  required
                />
              </Fieldset>

              <Fieldset label={estimator.volumeLabel} className="mt-5 lg:mt-4">
                <OptionGrid
                  options={estimator.volumes}
                  value={form.volume}
                  onChange={(v) => set("volume", v)}
                />
              </Fieldset>

              <Fieldset label={estimator.scopeLabel} className="mt-5 lg:mt-4">
                <OptionGrid
                  options={estimator.scopes}
                  value={form.scope}
                  onChange={(v) => set("scope", v)}
                />
              </Fieldset>

              {/* Company full width; phone + email side by side on sm+ */}
              <div className="mt-5 lg:mt-4 space-y-3.5 lg:space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-white/50">
                    {estimator.companyLabel}
                  </span>
                  <input
                    className="input-field-dark mt-1.5 !py-2.5 lg:!py-2"
                    placeholder={estimator.companyPlaceholder}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    required
                    autoComplete="organization"
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-white/50">
                      {estimator.phoneLabel}
                    </span>
                    <input
                      type="tel"
                      className="input-field-dark mt-1.5 !py-2.5 lg:!py-2"
                      placeholder={estimator.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-white/50">
                      {estimator.emailLabel}
                    </span>
                    <input
                      type="email"
                      className="input-field-dark mt-1.5 !py-2.5 lg:!py-2"
                      placeholder={estimator.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-5 lg:mt-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  {estimator.fileLabel}
                </span>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragEnter={(ev) => {
                    ev.preventDefault();
                    setDragOver(true);
                  }}
                  onDragOver={(ev) => {
                    ev.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={(ev) => {
                    ev.preventDefault();
                    setDragOver(false);
                  }}
                  onDrop={(ev) => {
                    ev.preventDefault();
                    setDragOver(false);
                    const dropped = ev.dataTransfer.files?.[0];
                    if (dropped) setSelectedFile(dropped);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "mt-2 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 text-center transition-colors cursor-pointer",
                    "lg:flex-row lg:justify-start lg:gap-3 lg:py-3.5 lg:text-left",
                    dragOver
                      ? "border-accent bg-accent/10"
                      : "border-white/15 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.04]",
                  )}
                >
                  <span className="flex h-10 w-10 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent-bright">
                    <FileUp className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex flex-col gap-0.5 lg:min-w-0">
                    <span className="text-sm font-medium text-white/80">
                      {estimator.fileBrowse}
                    </span>
                    <span className="text-xs text-white/45 lg:hidden">
                      {estimator.fileDrop}
                    </span>
                    <span className="text-[11px] tracking-wide text-white/30">
                      {estimator.fileFormats}
                    </span>
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_ATTR}
                    className="sr-only"
                    onChange={(ev) => {
                      const next = ev.target.files?.[0] ?? null;
                      setSelectedFile(next);
                    }}
                  />
                </div>

                {file && (
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
                    <span className="truncate text-sm text-white/70">
                      {file.name}
                      <span className="ml-2 text-xs text-white/35">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="inline-flex items-center gap-1 min-h-9 text-xs font-medium text-white/50 hover:text-white transition-colors shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                      {estimator.fileRemove}
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="mt-1.5 text-xs text-red-300/90">{fileError}</p>
                )}

                <p className="mt-2 text-xs leading-relaxed text-white/40">
                  {estimator.fileHint}
                </p>
              </div>

              <div className="mt-5 lg:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1 sm:flex-none min-h-11"
                  disabled={submitting}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  {submitting ? estimator.submittingCta : estimator.submitCta}
                </Button>
                <p className="text-xs text-white/35 sm:max-w-[16rem]">
                  {estimator.privacyNote}
                </p>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{successText}</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Fieldset({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45 mb-2.5 lg:mb-2">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-1.5">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-xl border px-4 py-3 lg:py-2.5 text-left text-sm font-medium transition-all duration-200",
              active
                ? "border-accent/50 bg-accent/15 text-white shadow-[0_0_0_1px_rgba(0,180,216,0.2)]"
                : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:text-white",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

