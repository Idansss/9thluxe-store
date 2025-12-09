import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignOutButton } from '@/components/auth/sign-out-button'

export async function UserMenu() {
  const session = await auth()
  if (!session) {
    return <Link className="btn-outline" href="/auth/signin">Sign in</Link>
  }
  return (
    <div className="flex items-center gap-2">
      <Link className="btn-outline" href="/account">My account</Link>
      <SignOutButton />
    </div>
  )
}
