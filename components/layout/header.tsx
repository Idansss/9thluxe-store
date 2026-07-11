"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react"

import { Logo } from "@/components/logo"
import { SearchDialog } from "@/components/search/search-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCartStore } from "@/lib/stores/cart-store"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Perfumes", href: "/category/perfumes" },
  { name: "Collections", href: "/collections" },
  { name: "Concierge", href: "/concierge" },
  { name: "Drops", href: "/drops" },
  { name: "Journal", href: "/journal" },
  { name: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const cartItemCount = useCartStore((state) => state.getUniqueItemsCount())

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 motion-reduce:transition-none",
        isScrolled
          ? "border-border bg-background/95 shadow-sm backdrop-blur-md"
          : "border-border/60 bg-background",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16 sm:gap-6">
          <Logo href="/" />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 motion-reduce:transition-none motion-reduce:after:transition-none",
                    isActive
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full",
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <SearchDialog />

            <Button variant="ghost" size="icon" className="hidden h-10 w-10 rounded-lg sm:flex" asChild>
              <Link href="/account/wishlist" className="text-foreground/80 hover:text-foreground">
                <Heart className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="hidden h-10 w-10 rounded-lg sm:flex" asChild>
              <Link href="/account" className="text-foreground/80 hover:text-foreground">
                <User className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                <span className="sr-only">Account</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg" asChild>
              <Link href="/cart" className="text-foreground/80 hover:text-foreground">
                <ShoppingBag className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                {cartItemCount > 0 ? (
                  <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                ) : null}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg lg:hidden"
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                >
                  <Menu className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                showClose={false}
                className="w-[min(20rem,calc(100vw-1rem))]"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse perfumes, collections, concierge, drops, journal and company information.
                </SheetDescription>

                <div className="flex h-full flex-col">
                  <div className="mb-8 flex items-center justify-between">
                    <Logo href="/" compact />
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-lg"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                      </Button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                      return (
                        <SheetClose key={item.name} asChild>
                          <Link
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "rounded-lg px-4 py-3.5 text-[15px] font-semibold transition-colors",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      )
                    })}
                  </nav>

                  <div className="mt-auto border-t border-border pt-8">
                    <div className="flex items-center gap-1">
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-lg" asChild>
                          <Link href="/account/wishlist" aria-label="Wishlist">
                            <Heart className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-lg" asChild>
                          <Link href="/account" aria-label="Account">
                            <User className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
