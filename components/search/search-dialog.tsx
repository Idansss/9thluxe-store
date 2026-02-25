"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import SearchBar from "@/components/SearchBar"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)

  const handleClose = React.useCallback(() => setOpen(false), [])

  // Close dialog when user clicks a search result (SearchBar calls onNavigate; this backs it up for outside clicks)
  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[role="option"]')) setTimeout(handleClose, 100)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [open, handleClose])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
          <span className="sr-only">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-semibold mb-2">Search Products</h2>
            <p className="text-sm text-muted-foreground">Find your favorite luxury items</p>
          </div>
          <SearchBar onNavigate={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
