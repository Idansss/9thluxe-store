"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { format } from "date-fns"

interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: Date
  user: {
    name?: string | null
  }
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  ratingCount: number
}

export function ProductReviews({ productId, reviews, averageRating, ratingCount }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      })

      if (response.ok) {
        setRating(0)
        setComment("")
        setShowForm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Customer Reviews</h3>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({ratingCount} reviews)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full border border-border bg-background px-6 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Write a review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="block text-sm font-medium">Your Rating</label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium">
              Your Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setRating(0)
                setComment("")
              }}
              className="rounded-full border border-border bg-background px-6 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {(review.user.name || "A")[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
