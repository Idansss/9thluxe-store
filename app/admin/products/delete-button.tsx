'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  productId: string
  productName: string
}

export function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}


