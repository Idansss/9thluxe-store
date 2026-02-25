"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const OCCASIONS = [
  { value: "daily", label: "Everyday wear" },
  { value: "evening", label: "Evening / special occasions" },
  { value: "work", label: "Office / professional" },
  { value: "date", label: "Date night" },
]

const NOTES = [
  { value: "citrus", label: "Citrus" },
  { value: "rose", label: "Rose" },
  { value: "oud", label: "Oud" },
  { value: "vanilla", label: "Vanilla" },
  { value: "woody", label: "Woody" },
  { value: "amber", label: "Amber" },
  { value: "sandalwood", label: "Sandalwood" },
  { value: "bergamot", label: "Bergamot" },
  { value: "patchouli", label: "Patchouli" },
]

const INTENSITY = [
  { value: "light", label: "Light & fresh" },
  { value: "medium", label: "Moderate" },
  { value: "bold", label: "Bold & long-lasting" },
]

export default function FindYourFragrancePage() {
  const router = useRouter()
  const [occasion, setOccasion] = useState<string>("")
  const [notes, setNotes] = useState<string[]>([])
  const [intensity, setIntensity] = useState<string>("")

  const toggleNote = (value: string) => {
    setNotes((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (occasion) params.set("occasion", occasion)
    if (notes.length) params.set("note", notes[0])
    if (intensity) params.set("intensity", intensity)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold text-foreground">Find your fragrance</h1>
        <p className="mb-8 text-muted-foreground">
          Answer a few questions and we’ll point you to scents that match your taste.
        </p>

        <form onSubmit={handleSubmit}>
          <Card className="space-y-8 p-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={occasion === opt.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOccasion(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Favourite notes (pick one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {NOTES.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={notes.includes(opt.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleNote(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Intensity
              </label>
              <div className="flex flex-wrap gap-2">
                {INTENSITY.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={intensity === opt.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIntensity(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Find my fragrances
            </Button>
          </Card>
        </form>
      </div>
    </MainLayout>
  )
}
