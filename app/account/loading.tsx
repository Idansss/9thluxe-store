import { RouteLoading } from "@/components/loading/route-loading"

/** Nested under account layout chrome: mark only, no second header. */
export default function AccountLoading() {
  return (
    <RouteLoading
      withChrome={false}
      label="Preparing your account"
      className="min-h-[40vh] py-16"
    />
  )
}
