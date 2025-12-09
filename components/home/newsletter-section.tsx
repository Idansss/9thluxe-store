import { NewsletterForm } from "@/components/ui/newsletter-form"



export function NewsletterSection() {

  return (

    <section className="py-16 lg:py-24 bg-card border-y border-border">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mx-auto text-center">

          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-4">Stay in the Know</h2>

          <p className="text-muted-foreground mb-8">

            Subscribe to receive exclusive offers, early access to new arrivals, and curated style inspiration.

          </p>

          <NewsletterForm />

          <p className="text-xs text-muted-foreground mt-4">

            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.

          </p>

        </div>

      </div>

    </section>

  )

}
