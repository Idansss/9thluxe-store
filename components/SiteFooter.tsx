import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'

const shopLinks = [
  { href: '/category/watches', label: 'Watches' },
  { href: '/category/perfumes', label: 'Perfumes' },
  { href: '/category/glasses', label: 'Eye Glasses' },
]

const helpLinks = [
  { href: '/', label: 'Home' },
  { href: '/help', label: 'Help Center' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
]

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Help</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Business Hours</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Mon-Sat: 8am - 9pm</li>
            <li>Sun: 12pm - 9pm</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Connect</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="https://wa.me/2348160591348"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                <span>+234 816 059 1348</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@9th.luxe"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                TikTok: @9th.luxe
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/9thluxee"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span>@9thluxee</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {year} 9thLuxe. All rights reserved.</p>
        <p className="mt-2">Nationwide delivery across Nigeria's 36 states and the FCT.</p>
      </div>
    </footer>
  )
}
