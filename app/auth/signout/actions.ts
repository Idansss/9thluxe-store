"use server"

import { signOut } from "@/lib/auth"

export async function signOutAction(redirectTo: string = "/") {
  try {
    await signOut({ redirectTo })
  } catch (error: any) {
    // NextAuth throws redirect errors, which is expected
    // If it's not a redirect error, re-throw it
    if (!error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    // Re-throw redirect errors so Next.js handles them
    throw error
  }
}

