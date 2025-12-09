"use client"

/**
 * Utility function to clear all user-scoped Zustand stores on logout.
 * This ensures no stale data persists after sign out.
 */
export function clearAllStores() {
  // Clear cart store
  if (typeof window !== "undefined") {
    localStorage.removeItem("fade-cart-storage")
    localStorage.removeItem("fade-wishlist-storage")
    localStorage.removeItem("fade-checkout-storage")
    localStorage.removeItem("fade-addresses-storage")
    localStorage.removeItem("fade-reviews-storage")
  }
}

