import { Worker } from "node:worker_threads";
import path from "node:path";

const DEFAULT_MAILBOX = "zakaz@aldetali.ru";

export type ContactMailInput = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  file: File | null;
};

export function smtpSettings() {
  const user = process.env.SMTP_USER?.trim() || DEFAULT_MAILBOX;
  const pass = process.env.SMTP_PASS?.trim() || "";
  const host = process.env.SMTP_HOST?.trim() || "smtp.spaceweb.ru";
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;
  return { host, port, user, pass, from };
}

function workerPath(): string {
  return path.join(process.cwd(), "src/lib/smtp-worker.cjs");
}

export async function sendViaSpacewebSmtp(
  input: ContactMailInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const smtp = smtpSettings();
  if (!smtp.pass) {
    console.error("[contact/smtp] SMTP_PASS is not set");
    return { ok: false, error: "SMTP is not configured" };
  }

  let fileBase64: string | undefined;
  let fileName: string | undefined;
  let fileType: string | undefined;
  if (input.file && input.file.size > 0) {
    fileBase64 = Buffer.from(await input.file.arrayBuffer()).toString("base64");
    fileName = input.file.name;
    fileType = input.file.type || undefined;
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: { ok: true } | { ok: false; error: string }) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let worker: Worker;
    try {
      worker = new Worker(workerPath(), {
        workerData: {
          host: smtp.host,
          port: smtp.port,
          user: smtp.user,
          pass: smtp.pass,
          from: smtp.from,
          to: input.to,
          replyTo: input.replyTo,
          subject: input.subject,
          text: input.text,
          fileBase64,
          fileName,
          fileType,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[contact/smtp] worker start", message);
      finish({ ok: false, error: "SMTP failed" });
      return;
    }

    const timer = setTimeout(() => {
      worker.terminate().catch(() => undefined);
      finish({ ok: false, error: "SMTP failed" });
    }, 20000);

    worker.on("message", (msg: { ok?: boolean; error?: string }) => {
      clearTimeout(timer);
      if (msg && msg.ok) finish({ ok: true });
      else {
        console.error("[contact/smtp]", msg?.error);
        finish({ ok: false, error: "SMTP failed" });
      }
    });
    worker.on("error", (error) => {
      clearTimeout(timer);
      console.error("[contact/smtp] worker", error);
      finish({ ok: false, error: "SMTP failed" });
    });
    worker.on("exit", (code) => {
      clearTimeout(timer);
      if (!settled) {
        console.error("[contact/smtp] worker exit", code);
        finish({ ok: false, error: "SMTP failed" });
      }
    });
  });
}
