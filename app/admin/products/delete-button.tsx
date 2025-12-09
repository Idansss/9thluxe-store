'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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

      const data = await response.json()

      if (response.ok) {
        toast.success('Product deleted', {
          description: `"${productName}" has been deleted successfully.`,
        })
        router.refresh()
      } else {
        // Show the specific error message from the server
        toast.error('Failed to delete product', {
          description: data.error || 'An error occurred while deleting the product.',
        })
      }
    } catch (error) {
      toast.error('Failed to delete product', {
        description: 'Please try again.',
      })
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


