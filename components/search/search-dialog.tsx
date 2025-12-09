"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import SearchBar from "@/components/SearchBar"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)

  // Close dialog when a product is selected (SearchBar navigates)
  React.useEffect(() => {
    if (!open) return

    const handleNavigation = () => {
      setOpen(false)
    }

    // Listen for clicks on search results
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[role="option"]')) {
        setTimeout(handleNavigation, 150)
      }
    }

    // Also listen for Enter key on search results
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLElement
        if (target.closest('[role="combobox"]')) {
          setTimeout(handleNavigation, 150)
        }
      }
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-semibold mb-2">Search Products</h2>
            <p className="text-sm text-muted-foreground">Find your favorite luxury items</p>
          </div>
          <SearchBar />
        </div>
      </DialogContent>
    </Dialog>
  )
}
