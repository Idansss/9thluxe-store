"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

function isBootstrapAdminEmail(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS || ""
  if (!raw) return false
  const allowList = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return allowList.includes(email.toLowerCase())
}

function normalizeCallbackUrl(value: string): string {
  return value.startsWith("/") ? value : "/account"
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = normalizeCallbackUrl(((formData.get("callbackUrl") as string) || "/account").trim())
  const rememberMe = formData.get("remember") === "true"

  try {
    const result = await signIn("credentials", {
      email,
      password,
      rememberMe: rememberMe ? "true" : "false",
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid email or password" }
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    })

    const isAdmin = user?.role === "ADMIN" || isBootstrapAdminEmail(email)
    redirect(isAdmin ? "/admin" : callbackUrl)
  } catch (error: any) {
    // NextAuth throws redirect errors, so check if it's a redirect
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error // Re-throw redirect errors
    }
    return { error: error.message || "Failed to sign in" }
  }
}

