"use client"

import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"

const SLIDES = [
  { image: "/hero/editorial/mayar-cherry.jpg", name: "Mayar Cherry Intense", house: "Lattafa", notes: "Cherry · dried fruit · warm woods", position: "center" },
  { image: "/hero/editorial/yara-vanilla.jpg", name: "Yara", house: "Lattafa", notes: "Vanilla · caramel · soft florals", position: "center" },
  { image: "/hero/editorial/angham.jpg", name: "Angham", house: "Lattafa", notes: "Amber · vanilla · warm spice", position: "center" },
  { image: "/hero/editorial/guidance-46.jpg", name: "Guidance 46", house: "Amouage", notes: "Pear · rose · frankincense", position: "center" },
  { image: "/hero/editorial/eclaire-notes.jpg", name: "Eclaire", house: "Lattafa", notes: "Caramel · milk · vanilla", position: "center" },
  { image: "/hero/editorial/eclaire.jpg", name: "Eclaire", house: "Lattafa", notes: "Honey · vanilla flower · praline", position: "center" },
  { image: "/hero/editorial/ana-abiyedh-coral.jpg", name: "Ana Abiyedh Coral", house: "Lattafa", notes: "Citrus · pear · radiant florals", position: "center" },
  { image: "/hero/editorial/khamrah.jpg", name: "Khamrah", house: "Lattafa", notes: "Cinnamon · nutmeg · warm woods", position: "center" },
] as const

const DWELL_MS = 5_600

export function EditorialSlideshow() {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const regionRef = React.useRef<HTMLDivElement>(null)
  const swipeStartRef = React.useRef<number | null>(null)

  const goTo = React.useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length)
  }, [])

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  React.useEffect(() => {
    const node = regionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), { threshold: 0.15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (paused || reducedMotion) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % SLIDES.length), DWELL_MS)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  const slide = SLIDES[active]

  return (
    <div
      ref={regionRef}
      className="relative mx-auto w-full max-w-[34rem]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Perfumes and their scent notes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onTouchStart={(event) => { swipeStartRef.current = event.touches[0]?.clientX ?? null }}
      onTouchEnd={(event) => {
        if (swipeStartRef.current === null) return
        const distance = event.changedTouches[0].clientX - swipeStartRef.current
        if (Math.abs(distance) > 45) goTo(active + (distance < 0 ? 1 : -1))
        swipeStartRef.current = null
      }}
    >
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-accent/[0.08] blur-3xl" aria-hidden />
      <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#161411] shadow-[0_35px_90px_rgba(0,0,0,0.42)] sm:aspect-[3/4]">
        {SLIDES.map((item, index) => (
          <Image
            key={item.image}
            src={item.image}
            alt={index === active ? `${item.name} by ${item.house}, styled with its scent notes` : ""}
            fill
            priority={index === 0}
            sizes="(max-width: 1023px) 92vw, 42vw"
            className={cn(
              "object-cover transition-[opacity,transform] ease-out",
              reducedMotion ? "duration-0" : "duration-[1200ms]",
              index === active ? "scale-100 opacity-100" : "pointer-events-none scale-[1.025] opacity-0",
            )}
            style={{ objectPosition: item.position }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/65">{slide.house}</p>
          <p className="mt-1 font-serif text-2xl sm:text-3xl">{slide.name}</p>
          <p className="mt-2 text-sm text-white/75">{slide.notes}</p>
        </div>
        <p className="absolute right-4 top-4 z-10 font-mono text-[10px] tracking-[0.22em] text-white/70" aria-hidden>
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1" role="group" aria-label="Choose a perfume slide">
        {SLIDES.map((item, index) => (
          <button
            key={item.image}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show ${item.name}`}
            aria-current={index === active ? "true" : undefined}
            className="group grid h-8 w-8 place-items-center"
          >
            <span className={cn("h-px transition-all", index === active ? "w-6 bg-accent" : "w-3 bg-border group-hover:bg-accent/60")} />
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Showing {slide.name} by {slide.house}. {slide.notes}.</p>
    </div>
  )
}
