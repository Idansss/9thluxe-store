import type { PdpData } from "@/lib/pdp/types"

/**
 * Plain-language "what it smells like". Every line is composed only from approved product fields;
 * any line without data is omitted. Nothing is invented.
 */
export function ScentExplanation({ story }: { story: PdpData["scentStory"] }) {
  const lines: { label: string; text: string }[] = []
  if (story.opening) lines.push({ label: "Opening", text: story.opening })
  if (story.heart) lines.push({ label: "Heart", text: story.heart })
  if (story.dryDown) lines.push({ label: "Dry-down", text: story.dryDown })

  if (!story.summary && lines.length === 0 && !story.mood) return null

  return (
    <div className="max-w-2xl space-y-6">
      {story.summary && <p className="font-serif text-xl leading-relaxed text-foreground md:text-2xl">{story.summary}</p>}

      {lines.length > 0 && (
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.label} className="flex flex-col gap-0.5 border-l-2 border-accent/40 pl-4">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{l.label}</span>
              <span className="text-sm text-foreground/90">{l.text}</span>
            </li>
          ))}
        </ul>
      )}

      {story.mood && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Mood: </span>
          {story.mood}
        </p>
      )}
    </div>
  )
}
