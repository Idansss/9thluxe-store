import Link from "next/link"
import { CheckCircle2, Clock3, AlertCircle } from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success"
import { auth } from "@/lib/auth"
import { formatPrice } from "@/lib/format"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ reference?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { reference: rawReference } = await searchParams
  const reference = rawReference?.trim()
  const session = await auth()
  const email = session?.user?.email

  const attempt =
    reference && email
      ? await prisma.paymentAttempt.findFirst({
          where: { providerReference: reference, order: { user: { email } } },
          select: {
            providerReference: true,
            order: {
              select: { id: true, status: true, totalNGN: true },
            },
          },
        })
      : null
  const order = attempt?.order

  const paid = order?.status === "PAID"
  const pending = order?.status === "PENDING"
  const title = paid
    ? "Order confirmed"
    : pending
      ? "Payment is processing"
      : "Payment status unavailable"
  const message = paid
    ? "Your payment is verified. A receipt is on its way to your inbox."
    : pending
      ? "We are waiting for confirmation from Paystack. Your order will update automatically; please do not pay twice."
      : "We could not match this payment to one of your orders. Check your orders or contact support if payment was taken."

  return (
    <MainLayout>
      <section className="min-h-[60vh] bg-background py-16 text-foreground lg:py-24">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          {paid && <ClearCartOnSuccess />}

          <div className="border border-border bg-card p-8 text-center sm:p-12">
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                paid
                  ? "bg-primary/10 text-primary"
                  : pending
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {paid ? (
                <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
              ) : pending ? (
                <Clock3 className="h-7 w-7" strokeWidth={1.5} />
              ) : (
                <AlertCircle className="h-7 w-7" strokeWidth={1.5} />
              )}
            </span>

            <h1 className="mt-6 font-serif text-3xl font-light md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {message}
            </p>

            {order && (
              <div className="mt-8 space-y-1.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Reference ·{" "}
                  <span className="text-foreground">
                    {attempt.providerReference}
                  </span>
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Amount ·{" "}
                  <span className="text-foreground">
                    {formatPrice(order.totalNGN)}
                  </span>
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/account/orders"
                className="inline-flex h-12 w-full items-center justify-center bg-primary px-7 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                View my orders
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 w-full items-center justify-center border border-border px-7 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:text-accent sm:w-auto"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
