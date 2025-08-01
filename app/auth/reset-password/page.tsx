"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [error, setError] = useState("")

  // ✅ Use `window.location` instead of `useSearchParams`
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      const tokenFromUrl = url.searchParams.get("token")
      const emailFromUrl = url.searchParams.get("email")

      if (tokenFromUrl) setToken(tokenFromUrl)
      if (emailFromUrl) setEmail(emailFromUrl)
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to reset password")
      }

      setIsReset(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "There was an error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md border-2 border-teal-100">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Right2Thrive UK Logo"
              width={80}
              height={80}
              className="mb-4 rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">Reset Password</CardTitle>
          <CardDescription>
            {!isReset
              ? "Enter your new password below"
              : "Your password has been reset successfully"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isReset ? (
            <form onSubmit={handleResetPassword}>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} disabled readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-600">Your password has been reset successfully.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button variant="ghost" className="flex items-center text-orange-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
