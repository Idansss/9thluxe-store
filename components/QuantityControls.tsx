"use client"

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface QuantityControlsProps {
  initialValue: number
  min?: number
  max?: number
  onUpdate: (newQuantity: number) => void
  disabled?: boolean
}

export function QuantityControls({ initialValue, min = 1, max = 999, onUpdate, disabled = false }: QuantityControlsProps) {
  const [quantity, setQuantity] = useState(initialValue)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleIncrement = async () => {
    if (disabled || isUpdating) return
    if (quantity >= max) return
    
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    setIsUpdating(true)
    
    try {
      await onUpdate(newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecrement = async () => {
    if (disabled || isUpdating) return
    if (quantity <= min) return
    
    const newQuantity = quantity - 1
    setQuantity(newQuantity)
    setIsUpdating(true)
    
    try {
      await onUpdate(newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isUpdating || quantity <= min}
        className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="h-4 w-4" />
      </button>
      
      <span className="w-12 text-center text-sm font-medium">{quantity}</span>
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isUpdating || quantity >= max}
        className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}



