import * as React from "react"
import { cn } from "@/lib/utils"

interface PdpSectionProps {
  id?: string
  eyebrow?: string
  title?: string
  description?: string
  className?: string
  /** When false, the section renders nothing at all (no empty card). */
  show?: boolean
  children: React.ReactNode
  headingLevel?: "h2" | "h3"
}

/**
 * Editorial section shell. Returns null when `show` is false so callers can express "hide when there
 * is no meaningful data" declaratively.
 */
export function PdpSection({
  id,
  eyebrow,
  title,
  description,
  className,
  show = true,
  children,
  headingLevel = "h2",
}: PdpSectionProps) {
  if (!show) return null
  const Heading = headingLevel
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-border/70 py-10 lg:py-14", className)}>
      {(eyebrow || title || description) && (
        <header className="mb-6 lg:mb-8 max-w-2xl">
          {eyebrow && <span className="eyebrow mb-2">{eyebrow}</span>}
          {title && (
            <Heading className={cn(headingLevel === "h2" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl", "font-serif")}>
              {title}
            </Heading>
          )}
          {description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
