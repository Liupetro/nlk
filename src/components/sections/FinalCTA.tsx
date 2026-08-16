"use client";

import { useCallback, useRef, useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileUp,
  Mail,
  MapPin,
  Phone,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import { useT } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MaterialSelect } from "@/components/ui/MaterialSelect";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  showHeading?: boolean;
};

const ACCEPTED_EXT = [".pdf", ".stp", ".step", ".jpg", ".jpeg", ".png"] as const;
const ACCEPT_ATTR = ACCEPTED_EXT.join(",");
const MAX_FILE_BYTES = 15 * 1024 * 1024;

function isAllowedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXT.some((ext) => lower.endsWith(ext));
}

export function FinalCTA({ showHeading = true }: Props) {
  const t = useT();
  const { contact } = t;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [material, setMaterial] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

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
        setFileError(contact.fileErrorType);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (next.size > MAX_FILE_BYTES) {
        setFile(null);
        setFileError(contact.fileErrorSize);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(next);
    },
    [contact.fileErrorType, contact.fileErrorSize],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    if (file) {
      data.set("file", file);
    } else {
      data.delete("file");
    }

    const materialValue = material || String(data.get("material") ?? "");
    const materialLabel =
      contact.materialOptions.find((o) => o.value === materialValue)?.label ??
      materialValue;
    data.set("material", materialValue);
    data.set("materialLabel", materialLabel);

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !json?.ok) {
        setError(contact.errorMessage);
        return;
      }

      setSubmitted(true);
      form.reset();
      setMaterial("");
      setSelectedFile(null);
    } catch {
      setError(contact.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={`relative bg-charcoal bg-noise overflow-hidden ${
        showHeading ? "py-20 lg:py-28" : "py-12 lg:py-20"
      }`}
    >
      <div className="absolute inset-0 bg-grid-fade opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 right-0 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            {showHeading && (
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright/90">
                  {contact.sectionLabel}
                </p>
                <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                  {contact.headline}
                </h2>
                <p className="mt-5 text-base sm:text-lg text-white/55 leading-relaxed">
                  {contact.subheadline}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.12} className={showHeading ? "mt-10 space-y-5" : "space-y-5"}>
              <ContactLine
                icon={Mail}
                label={contact.contactLabels.email}
                value={contact.email}
                href={`mailto:${contact.email}`}
                emphasize
              />
              <ContactLine
                icon={Phone}
                label={contact.contactLabels.phone}
                value={contact.phone}
                href={`tel:${contact.phoneTel}`}
              />
              <ContactLine
                icon={MapPin}
                label={contact.contactLabels.hq}
                value={contact.address}
              />
              <p className="text-sm text-white/35 pl-12">{contact.hours}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6"
              noValidate={false}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-x-3 sm:gap-y-2.5">
                <label className="block">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.name}
                  </span>
                  <input
                    className="input-field-dark mt-1 !py-2 !px-3 text-sm"
                    placeholder={contact.placeholders.name}
                    required
                    name="name"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.company}
                  </span>
                  <input
                    className="input-field-dark mt-1 !py-2 !px-3 text-sm"
                    placeholder={contact.placeholders.company}
                    required
                    name="company"
                    autoComplete="organization"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.phone}
                  </span>
                  <input
                    type="tel"
                    className="input-field-dark mt-1 !py-2 !px-3 text-sm"
                    placeholder={contact.placeholders.phone}
                    required
                    name="phone"
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.email}
                  </span>
                  <input
                    type="email"
                    className="input-field-dark mt-1 !py-2 !px-3 text-sm"
                    placeholder={contact.placeholders.email}
                    required
                    name="email"
                    autoComplete="email"
                  />
                </label>
                <div className="block sm:col-span-2">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.material}
                  </span>
                  <MaterialSelect
                    className="mt-1"
                    name="material"
                    required
                    compact
                    value={material}
                    placeholder={contact.placeholders.material}
                    onChange={setMaterial}
                    options={contact.materialOptions.map((opt) => ({
                      id: opt.value,
                      label: opt.label,
                    }))}
                  />
                </div>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.message}
                  </span>
                  <textarea
                    className="input-field-dark mt-1 !py-2 !px-3 text-sm min-h-[72px] resize-y"
                    placeholder={contact.placeholders.message}
                    required
                    name="message"
                    rows={3}
                  />
                </label>

                <div className="sm:col-span-2">
                  <span className="text-xs font-medium text-white/50">
                    {contact.labels.file}
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
                    className={[
                      "mt-1 flex items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 text-left transition-colors cursor-pointer",
                      dragOver
                        ? "border-accent bg-accent/10"
                        : "border-white/15 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent-bright">
                      <FileUp className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white/80 leading-snug">
                        {contact.fileBrowse}
                        <span className="font-normal text-white/45">
                          {" · "}
                          {contact.fileDrop}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] tracking-wide text-white/30">
                        {contact.fileFormats}
                      </span>
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="file"
                      accept={ACCEPT_ATTR}
                      className="sr-only"
                      onChange={(ev) => {
                        const next = ev.target.files?.[0] ?? null;
                        setSelectedFile(next);
                      }}
                    />
                  </div>

                  {file && (
                    <div className="mt-1.5 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
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
                        className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                        {contact.fileRemove}
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <p className="mt-1.5 text-xs text-red-300/90">{fileError}</p>
                  )}

                  <p className="mt-1.5 text-[11px] leading-snug text-white/35">
                    {contact.fileHint}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting}
                  icon={<Send className="h-4 w-4" />}
                >
                  {submitting ? contact.submittingCta : contact.submitCta}
                </Button>
                <p className="text-xs text-white/35">
                  {contact.orEmail}{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-accent-bright hover:underline"
                  >
                    {contact.email}
                  </a>
                </p>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="mt-3 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm text-success"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{contact.successMessage}</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2.5 text-sm text-red-200"
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

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
  emphasize = false,
  external = false,
  hideLabel = false,
  iconClassName = "h-4 w-4",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  emphasize?: boolean;
  external?: boolean;
  /** Show value only once (no small uppercase label above) */
  hideLabel?: boolean;
  iconClassName?: string;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent-bright">
        <Icon className={iconClassName} />
      </span>
      <span className={hideLabel ? "flex items-center min-h-10" : undefined}>
        {!hideLabel && (
          <span className="block text-[11px] uppercase tracking-wider text-white/35">
            {label}
          </span>
        )}
        <span
          className={[
            hideLabel ? "block" : "block mt-0.5",
            emphasize
              ? "text-base font-semibold tracking-tight text-accent-bright"
              : "text-sm text-white/80 group-hover:text-accent-bright transition-colors",
            hideLabel ? "font-medium tracking-tight" : "",
          ].join(" ")}
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-3 group hover:opacity-90 transition-opacity"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return <div className="flex items-start gap-3">{content}</div>;
}
