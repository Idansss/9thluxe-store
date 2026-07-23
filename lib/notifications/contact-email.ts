import { escapeHtml } from "@/lib/security/html"

interface ContactEmailInput {
  name: string
  email: string
  subject: string
  message: string
}

export function renderContactOwnerEmail(input: ContactEmailInput): string {
  const name = escapeHtml(input.name)
  const email = escapeHtml(input.email)
  const subject = escapeHtml(input.subject)
  const message = escapeHtml(input.message)

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2f3e33;">New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  `
}

export function renderContactReplyEmail(
  input: Pick<ContactEmailInput, "name" | "message">,
  storeEmail: string,
): string {
  const name = escapeHtml(input.name)
  const message = escapeHtml(input.message)
  const safeStoreEmail = escapeHtml(storeEmail)

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2f3e33; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-family: serif;">Fade Essence</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #2f3e33; margin-top: 0;">Thank you for reaching out, ${name}!</h2>
        <p>We've received your message and will get back to you within 24-48 hours.</p>
        <p><strong>Your message:</strong></p>
        <blockquote style="border-left: 3px solid #2f3e33; margin: 0; padding: 10px 20px; background: white; border-radius: 0 4px 4px 0;">
          <p style="white-space: pre-wrap; color: #555;">${message}</p>
        </blockquote>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          If you need urgent assistance, you can also reach us at ${safeStoreEmail} or +234 8160591348.
        </p>
      </div>
    </div>
  `
}
