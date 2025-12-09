"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Review {
  id: string
  productId: string
  orderId: string
  rating: number
  comment: string
  createdAt: string
  userName?: string
}

interface ReviewStore {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "createdAt">) => void
  getReviewsByProduct: (productId: string) => Review[]
  getReviewByOrderAndProduct: (orderId: string, productId: string) => Review | undefined
  hasReviewed: (orderId: string, productId: string) => boolean
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `${review.orderId}-${review.productId}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => {
          // Check if review already exists for this order+product combo
          const existingIndex = state.reviews.findIndex(
            (r) => r.orderId === review.orderId && r.productId === review.productId,
          )
          if (existingIndex >= 0) {
            // Update existing review
            const updated = [...state.reviews]
            updated[existingIndex] = newReview
            return { reviews: updated }
          }
          // Add new review
          return { reviews: [...state.reviews, newReview] }
        })
      },
      getReviewsByProduct: (productId) => {
        return get().reviews.filter((r) => r.productId === productId)
      },
      getReviewByOrderAndProduct: (orderId, productId) => {
        return get().reviews.find((r) => r.orderId === orderId && r.productId === productId)
      },
      hasReviewed: (orderId, productId) => {
        return get().reviews.some((r) => r.orderId === orderId && r.productId === productId)
      },
    }),
    {
      name: "fade-reviews-storage",
    },
  ),
)

