import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-sm font-medium text-muted-foreground">404</div>
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Uh oh, this page doesn't exist.</h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        The page you're looking for might have been moved or doesn't exist.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn">Go to Homepage</Link>
        <Link href="/category/watches" className="btn-outline">Shop now &gt;</Link>
      </div>
    </main>
  )
}
