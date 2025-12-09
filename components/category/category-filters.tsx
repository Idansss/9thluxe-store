"use client"



import * as React from "react"

import { SlidersHorizontal, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"



interface CategoryFiltersProps {

  brands?: string[]

  mobile?: boolean

  sortOnly?: boolean

}



const sortOptions = [

  { value: "newest", label: "Newest" },

  { value: "price-asc", label: "Price: Low to High" },

  { value: "price-desc", label: "Price: High to Low" },

  { value: "rating", label: "Highest Rated" },

]



export function CategoryFilters({ brands = [], mobile = false, sortOnly = false }: CategoryFiltersProps) {

  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])

  const [priceRange, setPriceRange] = React.useState<string[]>([])

  const [sortBy, setSortBy] = React.useState("newest")



  const priceRanges = [

    { value: "under-100k", label: "Under ₦100,000" },

    { value: "100k-500k", label: "₦100,000 - ₦500,000" },

    { value: "500k-1m", label: "₦500,000 - ₦1,000,000" },

    { value: "over-1m", label: "Over ₦1,000,000" },

  ]



  const toggleBrand = (brand: string) => {

    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))

  }



  const togglePriceRange = (range: string) => {

    setPriceRange((prev) => (prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]))

  }



  if (sortOnly) {

    return (

      <Select value={sortBy} onValueChange={setSortBy}>

        <SelectTrigger className="w-48 bg-transparent">

          <SelectValue placeholder="Sort by" />

        </SelectTrigger>

        <SelectContent>

          {sortOptions.map((option) => (

            <SelectItem key={option.value} value={option.value}>

              {option.label}

            </SelectItem>

          ))}

        </SelectContent>

      </Select>

    )

  }



  const FilterContent = () => (

    <div className="space-y-6">

      {/* Sort (Mobile) */}

      {mobile && (

        <div>

          <Label className="text-sm font-medium mb-3 block">Sort By</Label>

          <Select value={sortBy} onValueChange={setSortBy}>

            <SelectTrigger className="w-full bg-transparent">

              <SelectValue placeholder="Sort by" />

            </SelectTrigger>

            <SelectContent>

              {sortOptions.map((option) => (

                <SelectItem key={option.value} value={option.value}>

                  {option.label}

                </SelectItem>

              ))}

            </SelectContent>

          </Select>

        </div>

      )}



      {/* Brands */}

      <Collapsible defaultOpen>

        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">

          Brand

          <ChevronDown className="h-4 w-4" />

        </CollapsibleTrigger>

        <CollapsibleContent className="pt-3 space-y-3">

          {brands

            .filter((b) => b !== "All Brands")

            .map((brand) => (

              <div key={brand} className="flex items-center gap-2">

                <Checkbox

                  id={`brand-${brand}`}

                  checked={selectedBrands.includes(brand)}

                  onCheckedChange={() => toggleBrand(brand)}

                />

                <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">

                  {brand}

                </Label>

              </div>

            ))}

        </CollapsibleContent>

      </Collapsible>



      {/* Price Range */}

      <Collapsible defaultOpen>

        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">

          Price Range

          <ChevronDown className="h-4 w-4" />

        </CollapsibleTrigger>

        <CollapsibleContent className="pt-3 space-y-3">

          {priceRanges.map((range) => (

            <div key={range.value} className="flex items-center gap-2">

              <Checkbox

                id={`price-${range.value}`}

                checked={priceRange.includes(range.value)}

                onCheckedChange={() => togglePriceRange(range.value)}

              />

              <Label htmlFor={`price-${range.value}`} className="text-sm font-normal cursor-pointer">

                {range.label}

              </Label>

            </div>

          ))}

        </CollapsibleContent>

      </Collapsible>



      {/* Clear Filters */}

      {(selectedBrands.length > 0 || priceRange.length > 0) && (

        <Button

          variant="ghost"

          className="w-full"

          onClick={() => {

            setSelectedBrands([])

            setPriceRange([])

          }}

        >

          Clear All Filters

        </Button>

      )}

    </div>

  )



  if (mobile) {

    return (

      <Sheet>

        <SheetTrigger asChild>

          <Button variant="outline" className="w-full bg-transparent">

            <SlidersHorizontal className="h-4 w-4 mr-2" />

            Filters & Sort

          </Button>

        </SheetTrigger>

        <SheetContent side="left" className="w-80">

          <SheetHeader>

            <SheetTitle>Filters</SheetTitle>

          </SheetHeader>

          <div className="mt-6">

            <FilterContent />

          </div>

        </SheetContent>

      </Sheet>

    )

  }



  return <FilterContent />

}
