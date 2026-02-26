import { journalArticles } from "@/lib/journal-articles"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "The Journal | Fàdè",
  description: "Fragrance guides, editorial content, and olfactory education for the discerning nose.",
}

export default function JournalPage() {
  const [featured, ...rest] = journalArticles

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-[1200px] px-6 space-y-16">
        {/* Header */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Fàdè</p>
          <h1 className="text-4xl sm:text-5xl font-semibold">The Journal</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Fragrance education, seasonal guides, and the stories behind great perfumes.
          </p>
        </header>

        {/* Featured Article */}
        <Link
          href={`/journal/${featured.slug}`}
          className="group block rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-colors bg-card"
        >
          <div className="aspect-[16/6] bg-muted relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/5 to-muted group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-8 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary">{featured.category}</Badge>
              <span className="text-xs text-muted-foreground">{featured.readTime}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {new Date(featured.date).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold group-hover:text-primary transition-colors leading-tight">
              {featured.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center gap-2 text-sm font-medium text-primary pt-1">
              Read article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Article Grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors bg-card"
            >
              <div className="aspect-[16/7] bg-muted relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
