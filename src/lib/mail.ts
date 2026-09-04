import nodemailer from "nodemailer";

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
  const port = Number(process.env.SMTP_PORT || "465");
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;
  return {
    host,
    port,
    user,
    pass,
    from,
    secure: port === 465,
  };
}

export async function sendViaSpacewebSmtp(
  input: ContactMailInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const smtp = smtpSettings();
  if (!smtp.pass) {
    console.error("[contact/smtp] SMTP_PASS is not set");
    return { ok: false, error: "SMTP is not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    const attachments =
      input.file && input.file.size > 0
        ? [
            {
              filename: input.file.name,
              content: Buffer.from(await input.file.arrayBuffer()),
              contentType: input.file.type || undefined,
            },
          ]
        : undefined;

    await transporter.sendMail({
      from: `"НЛК" <${smtp.from}>`,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      attachments,
    });

    return { ok: true };
  } catch (error) {
    console.error("[contact/smtp]", error);
    return { ok: false, error: "SMTP failed" };
  } finally {
    transporter.close();
  }
}
