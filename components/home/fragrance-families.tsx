import Link from "next/link"

const FAMILIES = [
  {
    key: "CITRUS",
    name: "Citrus",
    mood: "Fresh & Energizing",
    description: "Bergamot, lemon, mandarin",
    gradient: "from-yellow-100 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/20",
    accent: "text-amber-700 dark:text-amber-400",
    emoji: "🍋",
  },
  {
    key: "WOODY",
    name: "Woody",
    mood: "Warm & Grounded",
    description: "Sandalwood, cedarwood, vetiver",
    gradient: "from-stone-100 to-amber-50 dark:from-stone-950/40 dark:to-amber-950/20",
    accent: "text-stone-700 dark:text-stone-400",
    emoji: "🪵",
  },
  {
    key: "FLORAL",
    name: "Floral",
    mood: "Soft & Romantic",
    description: "Rose, jasmine, tuberose",
    gradient: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20",
    accent: "text-rose-600 dark:text-rose-400",
    emoji: "🌹",
  },
  {
    key: "ORIENTAL",
    name: "Oriental",
    mood: "Exotic & Sensual",
    description: "Amber, oud, spices, incense",
    gradient: "from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30",
    accent: "text-orange-700 dark:text-orange-400",
    emoji: "✨",
  },
  {
    key: "FRESH",
    name: "Fresh",
    mood: "Clean & Airy",
    description: "Oceanic, aquatic, green",
    gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20",
    accent: "text-sky-600 dark:text-sky-400",
    emoji: "💧",
  },
  {
    key: "SPICY",
    name: "Spicy",
    mood: "Bold & Confident",
    description: "Pepper, cardamom, cinnamon",
    gradient: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
    accent: "text-red-600 dark:text-red-400",
    emoji: "🌶️",
  },
]

export function FragranceFamilies() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-[1200px] px-6 space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Explore by mood
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">Shop by Fragrance Family</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every great fragrance belongs to a family. Discover yours.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FAMILIES.map((family) => (
            <Link
              key={family.key}
              href={`/shop?family=${family.key}`}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${family.gradient} border border-transparent hover:border-border transition-all duration-300 hover:shadow-md`}
            >
              <div className="space-y-2">
                <span className="text-3xl" aria-hidden="true">
                  {family.emoji}
                </span>
                <div>
                  <p className={`text-lg font-semibold ${family.accent}`}>{family.name}</p>
                  <p className="text-sm font-medium text-foreground/80">{family.mood}</p>
                  <p className="text-xs text-muted-foreground mt-1">{family.description}</p>
                </div>
              </div>
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className={`text-xs font-semibold uppercase tracking-wider ${family.accent}`}>
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
