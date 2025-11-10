// app/account/addresses/new/page.tsx
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function NewAddressPage() {
  async function createAction(formData: FormData) {
    'use server'
    const user = await requireUser()

    const line1 = String(formData.get('line1') || '').trim()
    const city  = String(formData.get('city')  || '').trim()
    const state = String(formData.get('state') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const makeDefault = formData.get('isDefault') === 'on'

    if (!line1 || !city || !state || !phone) {
      throw new Error('All fields are required')
    }

    await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({ where: { userId: user.id, isDefault: true }, data: { isDefault: false } })
      }
      await tx.address.create({
        data: { userId: user.id, line1, city, state, phone, isDefault: makeDefault },
      })
    })

    redirect('/account/addresses')
  }

  return (
    <section className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Add address</h1>

      <form action={createAction} className="space-y-3 rounded border p-4">
        <div>
          <label className="block text-sm font-medium">Address line</label>
          <input name="line1" className="input w-full" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input name="city" className="input w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input name="state" className="input w-full" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input name="phone" className="input w-full" required />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isDefault" /> Make default
        </label>

        <div className="flex gap-2">
          <button className="btn" type="submit">Save</button>
          <a className="btn-outline" href="/account/addresses">Cancel</a>
        </div>
      </form>
    </section>
  )
}
