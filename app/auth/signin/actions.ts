"use server"

import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) || "/account"

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid email or password" }
    }

    // If successful, redirect
    redirect(callbackUrl)
  } catch (error: any) {
    // NextAuth throws redirect errors, so check if it's a redirect
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error // Re-throw redirect errors
    }
    return { error: error.message || "Failed to sign in" }
  }
}

