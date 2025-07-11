"use client"

import React, { useState, useEffect } from "react"
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      const tokenFromUrl = url.searchParams.get("token")
      const emailFromUrl = url.searchParams.get("email")

      if (tokenFromUrl) setToken(tokenFromUrl)
      if (emailFromUrl) setEmail(emailFromUrl)
      if (tokenFromUrl || emailFromUrl) setIsSubmitted(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send reset link")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "There was an error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
            {!isSubmitted
              ? "Enter your email address and we'll send you a link to reset your password"
              : token && !isReset
              ? "Enter the token from your email and your new password"
              : isReset
              ? "Your password has been reset successfully"
              : "Check your email for the reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : token && !isReset ? (
            <form onSubmit={handleResetPassword}>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter the token from your email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
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
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
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
          ) : !token && isSubmitted ? (
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-600">
                A password reset link has been sent to your email. Please check your inbox.
              </p>
            </div>
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
          {(!isSubmitted || token) && !isReset && (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="flex items-center text-orange-600 hover:text-teal-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          )}
          {isReset && (
            <Link href="/auth/login">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">Go to Login</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
