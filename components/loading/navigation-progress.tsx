"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * Thin top progress line for App Router navigations.
 * Starts on internal link clicks; completes when the destination route settles.
 * No artificial delay; cleans up on unmount and never jumps backwards.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`

  const [visible, setVisible] = React.useState(false)
  const [complete, setComplete] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const timers = React.useRef<number[]>([])
  const active = React.useRef(false)
  const progressRef = React.useRef(0)

  const clearTimers = React.useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }, [])

  const setProgressSafe = React.useCallback((value: number) => {
    const next = Math.max(progressRef.current, Math.min(100, value))
    progressRef.current = next
    setProgress(next)
  }, [])

  const finish = React.useCallback(() => {
    if (!active.current && progressRef.current === 0) return
    clearTimers()
    active.current = false
    setProgressSafe(100)
    setComplete(true)
    const hide = window.setTimeout(() => {
      setVisible(false)
      setComplete(false)
      progressRef.current = 0
      setProgress(0)
    }, 220)
    timers.current.push(hide)
  }, [clearTimers, setProgressSafe])

  const start = React.useCallback(() => {
    clearTimers()
    active.current = true
    progressRef.current = 0
    setProgress(0)
    setComplete(false)
    setVisible(true)

    // Quick rise, then patient crawl. Never reverse.
    timers.current.push(window.setTimeout(() => setProgressSafe(18), 16))
    timers.current.push(window.setTimeout(() => setProgressSafe(42), 120))
    timers.current.push(window.setTimeout(() => setProgressSafe(68), 280))
    timers.current.push(window.setTimeout(() => setProgressSafe(78), 700))
    timers.current.push(window.setTimeout(() => setProgressSafe(86), 1400))
  }, [clearTimers, setProgressSafe])

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as Element | null
      const anchor = target?.closest?.("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return

      try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
        const nextKey = `${url.pathname}?${url.searchParams.toString()}`
        const currentKey = `${window.location.pathname}?${window.location.search.replace(/^\?/, "")}`
        if (nextKey === currentKey) return
        start()
      } catch {
        // Ignore malformed hrefs.
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [start])

  React.useEffect(() => {
    finish()
    return () => clearTimers()
  }, [routeKey, finish, clearTimers])

  if (!visible && progress === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-critical)] h-[1.5px] overflow-hidden"
      aria-hidden
      data-navigation-progress={visible ? "active" : "idle"}
      data-complete={complete ? "true" : "false"}
    >
      <div
        className="navigation-progress-bar h-full origin-left bg-accent transition-[transform,opacity] duration-200 ease-out"
        style={{
          transform: `scaleX(${Math.max(progress, 2) / 100})`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  )
}
