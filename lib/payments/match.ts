export interface PaymentMatchInput {
  expectedReference: string | null
  receivedReference: string
  expectedAmountNGN: number
  receivedAmountNGN: number
  expectedCurrency: string
  receivedCurrency: string
  providerStatus: string | undefined
  paymentMethod: string
}

/** Pure payment invariant shared by webhook handling and security regression tests. */
export function matchesExpectedPayment(input: PaymentMatchInput): boolean {
  return (
    input.providerStatus === "success" &&
    input.paymentMethod === "CARD" &&
    input.expectedReference === input.receivedReference &&
    input.expectedAmountNGN === input.receivedAmountNGN &&
    input.expectedCurrency.toUpperCase() === input.receivedCurrency.toUpperCase()
  )
}
