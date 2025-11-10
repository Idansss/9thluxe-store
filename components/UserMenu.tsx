import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'

export async function UserMenu() {
  const session = await auth()
  if (!session) {
    return <Link className="btn-outline" href="/auth/signin">Sign in</Link>
  }
  return (
    <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
      <div className="flex items-center gap-2">
        <Link className="btn-outline" href="/account">My account</Link>
        <button className="btn-outline" type="submit">Sign out</button>
      </div>
    </form>
  )
}
