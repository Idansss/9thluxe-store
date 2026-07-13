import { MainLayout } from "@/components/layout/main-layout"
import { LogoMark } from "@/components/logo"
import { cn } from "@/lib/utils"

type RouteLoadingProps = {
  /** Short refined status copy shown after the delayed mark appears. */
  label?: string
  /** When true, wrap with site chrome so the header stays visible. */
  withChrome?: boolean
  hideFooter?: boolean
  className?: string
}

/**
 * Minimal premium route fallback. Keeps the house chrome stable and avoids
 * fake product-card skeletons. The mark is CSS-delayed so fast navigations
 * do not flash a full loader.
 */
export function RouteLoading({
  label = "Preparing the collection",
  withChrome = true,
  hideFooter = false,
  className,
}: RouteLoadingProps) {
  const body = (
    <div
      className={cn(
        "relative flex min-h-[52vh] flex-col items-center justify-center px-4 py-24",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="fade-loading-veil pointer-events-none absolute inset-0" aria-hidden />

      <div className="fade-loading-mark relative z-10 flex flex-col items-center gap-5">
        <span className="text-accent">
          <LogoMark className="h-9 w-[27px] text-accent" />
        </span>
        {label ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {label}
          </p>
        ) : null}
      </div>

      <span className="sr-only">Loading page</span>
    </div>
  )

  if (!withChrome) return body

  return <MainLayout hideFooter={hideFooter}>{body}</MainLayout>
}

/** Compact inline loader for grids, filters, and other local regions. */
export function LocalLoading({
  label = "Refining the selection",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-accent",
        className,
      )}
      aria-busy="true"
      role="status"
    >
      <LogoMark className="h-6 w-[18px] fade-loading-breathe" />
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <span className="sr-only">{label}</span>
    </div>
  )
}
