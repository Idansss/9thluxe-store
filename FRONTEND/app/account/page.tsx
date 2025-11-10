import { redirect } from "next/navigation"

export default function AccountPage() {
  // Redirect to overview by default
  redirect("/account/overview")
}
