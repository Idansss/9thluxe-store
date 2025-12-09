"use client"



import * as React from "react"

import Link from "next/link"

import { ShoppingBag } from "lucide-react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { CartItem } from "./cart-item"

import { CartSummary } from "./cart-summary"

import { useCartStore } from "@/lib/stores/cart-store"



export function CartContent() {

  const cartItems = useCartStore((state) => state.items)

  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const removeItem = useCartStore((state) => state.removeItem)

  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const getTotalItems = useCartStore((state) => state.getTotalItems)



  // Use cart items directly - they already contain all necessary product data
  const items = React.useMemo(() => {
    return cartItems.map((cartItem) => ({
      product: {
        id: cartItem.id,
        slug: cartItem.slug,
        name: cartItem.name,
        brand: cartItem.brand,
        price: cartItem.price,
        image: cartItem.image,
        // Add default values for fields that CartItem might expect
        description: "",
        rating: 0,
        reviewCount: 0,
        category: "watches" as const,
        images: [cartItem.image],
      },
      quantity: cartItem.quantity,
    }))
  }, [cartItems])



  const handleUpdateQuantity = (productId: string, newQuantity: number) => {

    if (newQuantity < 1) {

      handleRemoveItem(productId)

      return

    }

    updateQuantity(productId, newQuantity)

  }



  const handleRemoveItem = (productId: string) => {

    const item = items.find((i) => i.product.id === productId)

    removeItem(productId)

    toast.success("Item removed", {

      description: `${item?.product.name} has been removed from your cart.`,

    })

  }



  const subtotal = getTotalPrice()

  const itemCount = getTotalItems()



  if (items.length === 0) {

    return (

      <div className="text-center py-16">

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">

          <ShoppingBag className="h-8 w-8 text-muted-foreground" />

        </div>

        <h2 className="font-serif text-2xl font-semibold mb-2">Your cart is empty</h2>

        <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>

        <Button asChild>

          <Link href="/">Continue Shopping</Link>

        </Button>

      </div>

    )

  }



  return (

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

      {/* Cart Items */}

      <div className="lg:col-span-2 space-y-4">

        {items.map((item) => (

          <CartItem

            key={item.product.id}

            product={item.product}

            quantity={item.quantity}

            onUpdateQuantity={(qty) => handleUpdateQuantity(item.product.id, qty)}

            onRemove={() => handleRemoveItem(item.product.id)}

          />

        ))}

      </div>



      {/* Summary */}

      <div className="lg:col-span-1">

        <CartSummary subtotal={subtotal} itemCount={itemCount} />

      </div>

    </div>

  )

}
