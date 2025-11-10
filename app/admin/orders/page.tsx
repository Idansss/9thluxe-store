// app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { OrderStatus } from '@prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const PAGE_SIZE = 20

type Props = {
  searchParams: {
    q?: string
    status?: OrderStatus
    page?: string
  }
}

function Naira({ n }: { n: number }) {
  return <>₦{Number(n || 0).toLocaleString()}</>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin()

  const q = (searchParams.q || '').trim()
  const status = searchParams.status as OrderStatus | undefined
  const page = Math.max(1, Number(searchParams.page || 1))

  const where = {
    AND: [
      status ? { status } : {},
      q
        ? {
            OR: [
              { reference: { contains: q } },
              { user: { email: { contains: q } } },
              { items: { some: { product: { name: { contains: q } } } } },
            ],
          }
        : {},
    ],
  }

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        reference: true,
        status: true,
        totalNGN: true,
        createdAt: true,
        user: { select: { email: true } },
        items: {
          select: {
            quantity: true,
            product: { select: { slug: true, name: true } },
          },
        },
      },
    }),
  ])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // --- server action: update status ---
  async function updateStatus(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    const s = String(formData.get('status') || '') as OrderStatus
    if (!id || !Object.values(OrderStatus).includes(s)) return
    await prisma.order.update({ where: { id }, data: { status: s } })
    redirect(`/admin/orders?${new URLSearchParams({ q, status: status || '', page: String(page) })}`)
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="reference, email, product name"
            className="input w-72"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select name="status" defaultValue={status || ''} className="input">
            <option value="">All</option>
            {Object.values(OrderStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="btn">Filter</button>
        <Link
          href={`/admin/orders/export?${new URLSearchParams({ q, status: status || '' })}`}
          className="btn btn-secondary"
        >
          Export CSV
        </Link>
      </form>

      <div className="rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="p-2 text-left">Ref</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="p-2 font-medium">{o.reference || o.id.slice(0, 8)}</td>
                <td className="p-2">{o.user?.email || '—'}</td>
                <td className="p-2">
                  {o.items.slice(0, 3).map((it, i) => (
                    <span key={i}>
                      {it.quantity}×{' '}
                      <Link className="underline" href={`/product/${it.product.slug}`}>
                        {it.product.name}
                      </Link>
                      {i < o.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {o.items.length > 3 ? ` +${o.items.length - 3} more` : ''}
                </td>
                <td className="p-2"><Naira n={o.totalNGN} /></td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">
                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select name="status" defaultValue={o.status} className="input">
                      {Object.values(OrderStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="btn btn-sm">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-600" colSpan={7}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {pages} · {total} orders
          </div>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                className="btn btn-secondary btn-sm"
                href={`/admin/orders?${new URLSearchParams({ q, status: status || '', page: String(page - 1) })}`}
              >
                Prev
              </Link>
            )}
            {page < pages && (
              <Link
                className="btn btn-secondary btn-sm"
                href={`/admin/orders?${new URLSearchParams({ q, status: status || '', page: String(page + 1) })}`}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
