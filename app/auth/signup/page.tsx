"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  terms?: string
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateName = (name: string) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && calculatePasswordStrength(password) >= 3
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!validateName(formData.firstName)) {
      newErrors.firstName = "First name must be at least 2 characters and contain only letters"
    }
    
    if (!validateName(formData.lastName)) {
      newErrors.lastName = "Last name must be at least 2 characters and contain only letters"
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and numbers"
    }
    
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    // Validate form before submission
    if (!validateForm()) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            password_confirmation: formData.password,
            // Additional spam protection
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.success) {
        setSuccess(true)
        // Clear form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        })
        setTermsAccepted(false)
        setPasswordStrength(0)
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/auth/login?message=account-created")
        }, 2000)
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "There was an error creating your account. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 bg-gradient-to-br from-teal-50 to-white">
      <Card className="mx-auto w-full max-w-md border-2 border-teal-100 shadow-md rounded-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <Image
              src="/right2thrive-logo.jpg"
              alt="Right2Thrive UK - Cultural Wellbeing Hub Logo"
              width={120}
              height={120}
              className="mb-2 rounded-full"
              priority={true}
              quality={90}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">
            Join the Movement 🌱
          </CardTitle>
          <CardDescription className="px-4 text-gray-600 leading-relaxed">
            Be part of a safe and supportive community. <br />
            Sign up today to access your personal wellbeing space, find hope,
            and take the first step towards healing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Account Created Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Welcome to Right2Thrive UK! You'll be redirected to sign in shortly.
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Enhanced honeypot fields for spam protection */}
              <input
                type="text"
                name="website"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <input
                type="email"
                name="confirm_email"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={errors.firstName ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={errors.lastName ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : "password-help"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:ring-2 focus:ring-[#00990d] focus:ring-opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength: {
                        passwordStrength <= 2 ? "Weak" :
                        passwordStrength <= 3 ? "Fair" : "Strong"
                      }
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p id="password-error" className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.password}
                  </p>
                )}
                
                <p id="password-help" className="text-xs text-gray-500">
                  Password must be at least 8 characters long with a mix of
                  letters, numbers, and symbols.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    className="mt-1" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked as boolean)
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: undefined }))
                      }
                    }}
                    aria-required="true"
                    aria-invalid={!!errors.terms}
                    aria-describedby={errors.terms ? "terms-error" : undefined}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-orange-600 hover:text-teal-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-orange-600 hover:text-teal-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p id="terms-error" className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.terms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00990d] text-white hover:bg-[#007a0b] rounded-lg shadow-md focus:ring-4 focus:ring-[#00990d] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-describedby={error ? "error-message" : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            <Image
              src="/placeholder.svg?height=20&width=20"
              alt="Google logo for social signup"
              width={20}
              height={20}
              className="mr-2"
              priority={false}
              loading="lazy"
            />
            Sign up with Google
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-teal-700"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
