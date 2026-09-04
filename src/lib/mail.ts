import { spawn } from "node:child_process";
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

  const job = {
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
  };

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: { ok: true } | { ok: false; error: string }) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let child;
    try {
      child = spawn(process.execPath, [workerPath()], {
        env: { ...process.env, SMTP_JOB: JSON.stringify(job) },
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[contact/smtp] spawn", message);
      finish({ ok: false, error: "SMTP failed" });
      return;
    }

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish({ ok: false, error: "SMTP failed" });
    }, 25000);

    child.on("error", (error) => {
      clearTimeout(timer);
      console.error("[contact/smtp] child", error);
      finish({ ok: false, error: "SMTP failed" });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (stderr.trim()) console.error("[contact/smtp] stderr", stderr.trim());
      try {
        const parsed = JSON.parse(stdout || "{}") as { ok?: boolean; error?: string };
        if (parsed.ok) {
          finish({ ok: true });
          return;
        }
        console.error("[contact/smtp]", parsed.error || `exit ${code}`);
      } catch {
        console.error("[contact/smtp] bad child output", stdout, stderr);
      }
      finish({ ok: false, error: "SMTP failed" });
    });
  });
}
