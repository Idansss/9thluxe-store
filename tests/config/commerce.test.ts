import { describe, it, expect } from 'vitest'
import {
  computeCheckoutShipping,
  computeShipping,
  resolveLoyaltyTier,
  isSupportedCurrency,
} from '@/lib/config/commerce'

describe('shipping policy (config-driven, no hard-coded threshold)', () => {
  it('is free at or above the configured threshold (default 500,000)', () => {
    expect(computeShipping(500_000)).toBe(0)
    expect(computeShipping(750_000)).toBe(0)
  })
  it('charges the flat fee below the threshold', () => {
    expect(computeShipping(499_999)).toBe(2_500)
    expect(computeShipping(0)).toBe(2_500)
  })
  it('calculates delivery and gift wrapping entirely from server policy', () => {
    expect(computeCheckoutShipping(100_000, 'standard', false)).toBe(2_500)
    expect(computeCheckoutShipping(100_000, 'express', false)).toBe(35_000)
    expect(computeCheckoutShipping(100_000, 'express', true)).toBe(37_500)
    expect(computeCheckoutShipping(500_000, 'express', true)).toBe(2_500)
  })
})

describe('loyalty tiers (config-driven)', () => {
  it('maps lifetime spend to the correct tier', () => {
    expect(resolveLoyaltyTier(0)).toBe('STANDARD')
    expect(resolveLoyaltyTier(199_999)).toBe('STANDARD')
    expect(resolveLoyaltyTier(200_000)).toBe('OBSIDIAN')
    expect(resolveLoyaltyTier(1_000_000)).toBe('GOLD')
    expect(resolveLoyaltyTier(5_000_000)).toBe('PLATINUM')
    expect(resolveLoyaltyTier(9_999_999)).toBe('PLATINUM')
  })
})

describe('currency validation', () => {
  it('accepts NGN (default) and rejects others', () => {
    expect(isSupportedCurrency('NGN')).toBe(true)
    expect(isSupportedCurrency('ngn')).toBe(true)
    expect(isSupportedCurrency('USD')).toBe(false)
  })
})
