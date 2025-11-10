import Link from "next/link"
import crypto from "node:crypto"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TogglePreference } from "./toggle-preference"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const session = await auth()
  const email = session?.user?.email

  if (!email) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          Please{" "}
          <Link href="/auth/signin" className="font-medium text-foreground underline">
            sign in
          </Link>{" "}
          to manage your account preferences.
        </div>
      </div>
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) redirect("/auth/signin")

  const marketingOptIn = (user as any).marketingEmails ?? true
  const smsOptIn = (user as any).smsNotifications ?? false

  async function deleteAccount() {
    "use server"
    const existing = await prisma.user.findUnique({ where: { id: user!.id } })
    if (!existing) redirect("/auth/signin")

    try {
      await prisma.session.deleteMany({ where: { userId: existing.id } })
      await prisma.account.deleteMany({ where: { userId: existing.id } })
      await prisma.wishlist.deleteMany({ where: { userId: existing.id } })
      await prisma.address.deleteMany({ where: { userId: existing.id } })
    } catch {
      // ignore cleanup errors
    }

    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: null,
        email: `deleted-${existing.id}@example.invalid`,
        passwordHash: crypto.randomBytes(32).toString("hex"),
        marketingEmails: false,
      } as any,
    })

    redirect("/auth/signin")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you hear from us and keep your account information up to date.
        </p>
      </div>

      <section className="space-y-6">
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notifications</h3>
          </div>
          <div className="divide-y divide-border">
            <TogglePreference
              title="Email notifications"
              description="Receive order updates via email."
              enabled={marketingOptIn}
              email={email}
            />
            <TogglePreference
              title="SMS notifications"
              description="Receive order updates via SMS."
              enabled={smsOptIn}
              email={email}
              type="sms"
            />
            <TogglePreference
              title="Promotional emails"
              description="Receive special offers and product drops."
              enabled={marketingOptIn}
              email={email}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account details</h3>
          </div>
          <dl className="divide-y divide-border text-sm">
            <DetailRow label="Email address" value={user.email} />
            <DetailRow label="Name" value={user.name ?? "Not set"} />
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Danger zone</h3>
          </div>
          <div className="space-y-3 px-6 py-5 text-sm text-muted-foreground">
            <p>
              Deleting your account removes your profile information and signs you out on all devices. Order history is
              retained for bookkeeping.
            </p>
            <form action={deleteAccount}>
              <button className="btn-outline w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" type="submit">
                Delete account
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}
