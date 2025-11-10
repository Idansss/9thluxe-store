import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ShoppingBag, User, Phone } from 'lucide-react'

import { UserMenu } from '@/components/UserMenu'
import { getCart } from '@/components/cartActions'
import { ThemeToggle } from '@/components/ThemeToggle'

const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false })

export async function SiteHeader() {
  const cartItems = await getCart()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          9thLuxe
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar />
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-4">
          <a
            href="tel:+2348160591348"
            className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">+234 816 059 1348</span>
          </a>
          <ThemeToggle />
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground relative"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <UserMenu />
        </nav>
      </div>

      {/* Primary Navigation */}
      <div className="border-t border-border">
        <div className="container mx-auto max-w-[1200px] px-6">
          <nav className="flex items-center gap-8 py-3">
            <Link href="/category/watches" className="text-sm font-medium transition-colors hover:text-muted-foreground">
              Watches
            </Link>
            <Link href="/category/perfumes" className="text-sm font-medium transition-colors hover:text-muted-foreground">
              Perfumes
            </Link>
            <Link href="/category/glasses" className="text-sm font-medium transition-colors hover:text-muted-foreground">
              Eye Glasses
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
