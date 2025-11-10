import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const user = await requireUser()

  async function updateProfile(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    const marketing = formData.get("marketingEmails") === "on"

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        marketingEmails: marketing,
      } as any,
    })

    redirect("/account/profile")
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Update your contact information and preferences.</p>
      </header>

      <form action={updateProfile} className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:max-w-md">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" defaultValue={user.name ?? ""} className="input w-full" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <input id="email" value={user.email} disabled className="input w-full opacity-70" />
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="marketingEmails" defaultChecked={Boolean((user as any).marketingEmails ?? true)} />
          Receive product updates and deals
        </label>

        <button className="btn">Save changes</button>
      </form>
    </section>
  )
}

