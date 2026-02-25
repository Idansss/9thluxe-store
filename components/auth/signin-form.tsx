"use client"

import * as React from "react"

import Link from "next/link"

import { useSearchParams } from "next/navigation"

import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"

import { toast } from "sonner"

import { signInAction } from "@/app/auth/signin/actions"



export function SignInForm() {

  const searchParams = useSearchParams()

  const [showPassword, setShowPassword] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)

  const [rememberMe, setRememberMe] = React.useState(false)



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    setIsLoading(true)



    const formData = new FormData(e.currentTarget)

    const callbackUrl = searchParams.get("callbackUrl") || "/account"

    formData.append("callbackUrl", callbackUrl)

    formData.set("remember", rememberMe ? "true" : "false")



    const result = await signInAction(formData)



    if (result?.error) {

      toast.error("Sign in failed", {

        description: result.error === "CredentialsSignin" 

          ? "Invalid email or password. Please try again."

          : result.error,

      })

      setIsLoading(false)

    } else {

      // Success - the server action will redirect

      toast.success("Signed in successfully", {

        description: "Welcome back!",

      })

    }

  }



  return (

    <Card>

      <CardContent className="pt-6">

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">

            <Label htmlFor="email">Email</Label>

            <Input

              id="email"

              name="email"

              type="email"

              placeholder="you@example.com"

              required

              disabled={isLoading}

            />

          </div>



          <div className="space-y-2">

            <Label htmlFor="password">Password</Label>

            <div className="relative">

              <Input

                id="password"

                name="password"

                type={showPassword ? "text" : "password"}

                placeholder="Enter your password"

                required

                disabled={isLoading}

              />

              <Button

                type="button"

                variant="ghost"

                size="icon"

                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"

                onClick={() => setShowPassword(!showPassword)}

              >

                {showPassword ? (

                  <EyeOff className="h-4 w-4 text-muted-foreground" />

                ) : (

                  <Eye className="h-4 w-4 text-muted-foreground" />

                )}

                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>

              </Button>

            </div>

          </div>



          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-2">

              <Checkbox

                id="remember"

                checked={rememberMe}

                onCheckedChange={(checked) => setRememberMe(checked === true)}

                aria-label="Remember me"
              />

              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">

                Remember me

              </Label>

            </div>

            <Link href="/auth/reset" className="text-sm text-primary hover:underline">

              Forgot password?

            </Link>

          </div>



          <Button type="submit" className="w-full h-11" disabled={isLoading}>

            {isLoading ? "Signing in..." : "Sign in"}

          </Button>

        </form>

      </CardContent>

    </Card>

  )

}
