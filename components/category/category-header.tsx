interface CategoryHeaderProps {

  title: string

  subtitle: string

  description?: string

}



export function CategoryHeader({ title, subtitle, description }: CategoryHeaderProps) {

  return (

    <div className="bg-card border-b border-border">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        <div className="max-w-2xl">

          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight mb-3">{title}</h1>

          <p className="text-lg text-muted-foreground">{subtitle}</p>

          {description && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{description}</p>}

        </div>

      </div>

    </div>

  )

}
