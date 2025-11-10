// lib/email.ts
import nodemailer from 'nodemailer'

export async function sendOrderEmail(to: string, subject: string, html: string) {
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  })
  await t.sendMail({
    from: process.env.FROM_EMAIL || 'no-reply@example.com',
    to,
    subject,
    html,
  })
}
