import { env } from "@/lib/env"

export interface BankTransferConfig {
  accountName: string
  bankName: string
  accountNumber: string
}

/** Manual transfer is hidden and rejected unless every owner-approved field is present. */
export function getBankTransferConfig(): BankTransferConfig | null {
  if (!env.BANK_TRANSFER_ENABLED) return null

  const accountName = env.BANK_TRANSFER_ACCOUNT_NAME?.trim()
  const bankName = env.BANK_TRANSFER_BANK_NAME?.trim()
  const accountNumber = env.BANK_TRANSFER_ACCOUNT_NUMBER?.trim()

  if (!accountName || !bankName || !accountNumber) return null
  return { accountName, bankName, accountNumber }
}
