"use client"



import * as React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"

import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { ThemeToggle } from "@/components/ui/theme-toggle"

import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

import { SearchDialog } from "@/components/search/search-dialog"

import { useCartStore } from "@/lib/stores/cart-store"



const navigation = [
  { name: "Perfumes", href: "/category/perfumes" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Help", href: "/help" },
]



interface HeaderProps {}

export function Header(_props: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const cartItemCount = useCartStore((state) => state.getUniqueItemsCount())



  React.useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 10)

    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])



  return (

    <header

      className={cn(

        "sticky top-0 z-50 w-full transition-all duration-300",

        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-background",

      )}

    >

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between gap-4">

          {/* Brand */}
          <Logo href="/" />



          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-1">

            {navigation.map((item) => (

              <Link

                key={item.name}

                href={item.href}

                className={cn(

                  "px-4 py-2 text-sm font-medium transition-colors relative",

                  pathname === item.href || pathname.startsWith(item.href + "/")

                    ? "text-foreground"

                    : "text-muted-foreground hover:text-foreground",

                )}

              >

                {item.name}

                {(pathname === item.href || pathname.startsWith(item.href + "/")) && (

                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full" />

                )}

              </Link>

            ))}

          </nav>



          {/* Right Actions */}

          <div className="flex items-center gap-1">

            <ThemeToggle />



            <div className="hidden sm:flex">

              <SearchDialog />

            </div>



            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex" asChild>

              <Link href="/account/wishlist">

                <Heart className="h-4 w-4" />

                <span className="sr-only">Wishlist</span>

              </Link>

            </Button>



            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex" asChild>

              <Link href="/account">

                <User className="h-4 w-4" />

                <span className="sr-only">Account</span>

              </Link>

            </Button>



            <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>

              <Link href="/cart">

                <ShoppingBag className="h-4 w-4" />

                {cartItemCount > 0 && (

                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">

                    {cartItemCount > 99 ? "99+" : cartItemCount}

                  </span>

                )}

                <span className="sr-only">Cart</span>

              </Link>

            </Button>



            {/* Mobile Menu */}

            <Sheet>

              <SheetTrigger asChild>

                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">

                  <Menu className="h-5 w-5" />

                  <span className="sr-only">Open menu</span>

                </Button>

              </SheetTrigger>

              <SheetContent side="right" className="w-80">

                <div className="flex flex-col h-full">

                  <div className="flex items-center justify-between mb-8">

                    <Logo href="/" compact />

                    <SheetClose asChild>

                      <Button variant="ghost" size="icon" className="h-9 w-9">

                        <X className="h-5 w-5" />

                      </Button>

                    </SheetClose>

                  </div>



                  <nav className="flex flex-col gap-1">

                    {navigation.map((item) => (

                      <SheetClose key={item.name} asChild>

                        <Link

                          href={item.href}

                          className={cn(

                            "px-4 py-3 text-base font-medium rounded-lg transition-colors",

                            pathname === item.href || pathname.startsWith(item.href + "/")

                              ? "bg-accent/10 text-foreground"

                              : "text-muted-foreground hover:bg-muted hover:text-foreground",

                          )}

                        >

                          {item.name}

                        </Link>

                      </SheetClose>

                    ))}

                  </nav>



                  <div className="mt-auto pt-8 border-t border-border">

                    <div className="flex items-center gap-2">

                      <SheetClose asChild>

                        <div className="h-10 w-10 flex items-center justify-center">

                          <SearchDialog />

                        </div>

                      </SheetClose>

                      <SheetClose asChild>

                        <Button variant="ghost" size="icon" className="h-10 w-10" asChild>

                          <Link href="/account/wishlist">

                            <Heart className="h-5 w-5" />

                          </Link>

                        </Button>

                      </SheetClose>

                      <SheetClose asChild>

                        <Button variant="ghost" size="icon" className="h-10 w-10" asChild>

                          <Link href="/account">

                            <User className="h-5 w-5" />

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
