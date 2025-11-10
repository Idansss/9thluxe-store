import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function SecurityPage() {
  const user = await requireUser()

  async function changePassword(formData: FormData) {
    "use server"
    const currentPassword = String(formData.get("currentPassword") || "")
    const newPassword = String(formData.get("newPassword") || "")

    if (!currentPassword || !newPassword) {
      redirect("/account/security")
    }

    const record = await prisma.user.findUnique({ where: { id: user.id } })
    if (!record?.passwordHash) {
      redirect("/account/security")
    }

    const match = await bcrypt.compare(currentPassword, record.passwordHash)
    if (!match) {
      redirect("/account/security")
    }

    const nextHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: nextHash },
    })

    redirect("/account/security")
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Security</h1>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
      </header>

      <form action={changePassword} className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-1">
          <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
            Current password
          </label>
          <input id="currentPassword" name="currentPassword" type="password" required className="input w-full" />
        </div>
        <div className="space-y-1">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New password
          </label>
          <input id="newPassword" name="newPassword" type="password" required className="input w-full" />
        </div>
        <button className="btn">Update password</button>
      </form>
    </section>
  )
}
