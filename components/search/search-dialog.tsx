"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import SearchBar from "@/components/SearchBar"

interface SearchDialogProps {
  onOpenChange?: (open: boolean) => void
}

export function SearchDialog({ onOpenChange }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false)

  const updateOpen = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange],
  )

  const handleClose = React.useCallback(() => updateOpen(false), [updateOpen])

  React.useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[role="option"]')) setTimeout(handleClose, 100)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [open, handleClose])

  return (
    <Dialog open={open} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold text-foreground/80 transition-all hover:bg-muted/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Search"
        >
          <Search className="h-5 w-5 shrink-0" strokeWidth={2.25} />
          <span className="sr-only">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[600px]">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="mb-2 font-serif text-2xl font-semibold">Search perfumes</h2>
            <p className="text-sm text-muted-foreground">Find your next fragrance</p>
          </div>
          <SearchBar onNavigate={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
