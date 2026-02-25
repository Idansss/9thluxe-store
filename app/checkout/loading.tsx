export default function CheckoutLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 space-y-8 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-12 rounded-lg bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
          <div className="h-32 rounded-lg bg-muted" />
        </div>
        <div className="h-80 rounded-lg bg-muted" />
      </div>
    </div>
  )
}
