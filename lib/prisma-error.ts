type MaybePrismaError = {
  code?: string
  message?: string
}

export function isPrismaSchemaMissingError(error: unknown): boolean {
  const prismaError = error as MaybePrismaError
  const message = prismaError?.message || ""
  const code = prismaError?.code || ""

  return (
    code === "P2021" ||
    code === "P2022" ||
    message.includes("does not exist in the current database") ||
    (message.includes("relation") && message.includes("does not exist"))
  )
}

export function toSafeAuthErrorMessage(error: unknown): string {
  if (isPrismaSchemaMissingError(error)) {
    return "Database is not initialized yet. Please try again in a few minutes."
  }

  return "Failed to create account. Please try again."
}
