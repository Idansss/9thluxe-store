"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  dropDate: string // ISO string
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    min: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    sec: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export function CountdownTimer({ dropDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft(dropDate))
    const id = setInterval(() => setTimeLeft(getTimeLeft(dropDate)), 1000)
    return () => clearInterval(id)
  }, [dropDate])

  if (!mounted) return null

  if (!timeLeft) {
    return <span className="text-green-400 font-semibold text-sm tracking-wide">Available now</span>
  }

  return (
    <div className="flex gap-3">
      {Object.entries(timeLeft).map(([unit, val]) => (
        <div key={unit} className="text-center">
          <div className="text-2xl font-mono font-bold tabular-nums">
            {String(val).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 mt-0.5">{unit}</div>
        </div>
      ))}
    </div>
  )
}
