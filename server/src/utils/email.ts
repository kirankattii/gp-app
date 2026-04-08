import * as nodemailer from "nodemailer";

import logger from "../config/logger";

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (transporter) return transporter;

  const missing = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.EMAIL_FROM) missing.push("EMAIL_FROM");

  if (missing.length > 0) {
    console.error(`❌ Missing email environment variables: ${missing.join(", ")}`);
    throw new Error(`Email configuration missing: ${missing.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT ?? 587);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // true for port 465 (implicit SSL), false for other ports (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from: string = process.env.EMAIL_FROM!,
) {
  logger.info(`📧 Attempting to send email to ${to} with subject: "${subject}"`);
  try {
    const transporter = getEmailTransporter();

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    logger.info(`✅ Email sent successfully: ${info.messageId}`);

    return true;
  } catch (error) {
    logger.error("❌ Email sending failed:", error);
    return false;
  }
}
