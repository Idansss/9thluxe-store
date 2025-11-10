import Link from "next/link"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function AddressesPage() {
  const user = await requireUser()

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  if (addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        You have not saved any addresses yet.{" "}
        <Link href="/account/addresses/new" className="font-medium text-foreground underline">
          Add your first address
        </Link>
        .
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Addresses</h1>
        <Link href="/account/addresses/new" className="btn">
          Add new
        </Link>
      </div>

      <ul className="space-y-3">
        {addresses.map((address) => (
          <li key={address.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 text-sm">
                <div className="font-medium text-foreground">{address.line1}</div>
                <div className="text-muted-foreground">
                  {address.city}, {address.state}
                </div>
                <div className="text-muted-foreground">{address.phone}</div>
                {address.isDefault && (
                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Default address
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <form action={setDefaultAction.bind(null, address.id)}>
                  <button className="btn-outline px-3 py-2 text-sm" type="submit" disabled={address.isDefault}>
                    Make default
                  </button>
                </form>
                <form action={deleteAction.bind(null, address.id)}>
                  <button className="btn-outline px-3 py-2 text-sm" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

async function setDefaultAction(addressId: string) {
  "use server"
  const user = await requireUser()

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId, userId: user.id },
      data: { isDefault: true },
    }),
  ])
}

async function deleteAction(addressId: string) {
  "use server"
  const user = await requireUser()
  await prisma.address.delete({
    where: { id: addressId, userId: user.id },
  })
}

