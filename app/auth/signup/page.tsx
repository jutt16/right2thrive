"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
// --- Options Constants ---
const GENDER_OPTIONS = [
  "Female", "Male", "Non Binary", "Transfeminine", "Transmasculine",
  "Agender", "I don't know", "Prefer not to say", "Other"
]

const ISSUES_OPTIONS = [
  "Stress or Anxiety", "Depression", "School challenges", "ADHD/ADD",
  "Addiction", "Trauma or abuse", "Loss of a loved one",
  "Relationship with friends", "Family conflicts", "Fears or phobias",
  "Anger issues", "Panic attacks", "Trouble sleeping or insomnia",
  "Eating disorders", "LGBTQ issues", "Other"
]

const THERAPY_HISTORY_OPTIONS = [
  "Never", "Briefly", "For a few sessions", "Over 10 sessions"
]

const PARENT_RELATIONSHIP_OPTIONS = [
  "Poor", "Fair", "Good"
]

const SUICIDE_THOUGHTS_OPTIONS = [
  "Never", "Over a year ago", "Over 3 months ago",
  "Over a month ago", "Over 2 weeks ago", "In the last 2 weeks"
]

const SCHOOL_STATUS_OPTIONS = [
  "Yes regularly", "Yes, but I skip school sometimes", "No"
]

const LIVING_SITUATION_OPTIONS = [
  "At home with both of your parents", "At home with one parent",
  "Split custody with both parents", "Other"
]

interface FormErrors {
  [key: string]: string | undefined
}

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,

    // Step 2 & 3: Profile
    gender_identity: "",
    age: "",
    issues_facing: [] as string[],
    therapy_history: "",
    relationship_with_parents: "",
    last_suicide_thought: "",
    school_status: "",
    living_situation: "",
    country: "",
    preferred_therapy_language: "",
  })

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleCheckboxChange = (option: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.issues_facing
      const updated = checked
        ? [...current, option]
        : current.filter(item => item !== option)
      return { ...prev, issues_facing: updated }
    })
  }

  // Validation Logic
  const validateStep = (currentStep: number) => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required"
      if (!formData.password || formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    if (currentStep === 2) {
      if (!formData.gender_identity) newErrors.gender_identity = "Please select your gender identity"
      if (!formData.age) newErrors.age = "Please enter your age"
      if (!formData.country.trim()) newErrors.country = "Country is required"
      if (!formData.preferred_therapy_language.trim()) newErrors.preferred_therapy_language = "Language is required"
      if (!formData.school_status) newErrors.school_status = "Please select your school status"
      if (!formData.living_situation) newErrors.living_situation = "Please select your living situation"
    }

    if (currentStep === 3) {
      if (formData.issues_facing.length === 0) newErrors.issues_facing = "Please select at least one issue"
      if (!formData.therapy_history) newErrors.therapy_history = "Please tell us about your therapy history"
      if (!formData.relationship_with_parents) newErrors.relationship_with_parents = "Please rate your relationship with parents"
      if (!formData.last_suicide_thought) newErrors.last_suicide_thought = "Please answer this question"
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      isValid = false
    }

    return isValid
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,

            gender_identity: formData.gender_identity,
            age: parseInt(formData.age),
            issues_facing: formData.issues_facing,
            therapy_history: formData.therapy_history,
            relationship_with_parents: formData.relationship_with_parents,
            last_suicide_thought: formData.last_suicide_thought,
            school_status: formData.school_status,
            living_situation: formData.living_situation,
            country: formData.country,
            preferred_therapy_language: formData.preferred_therapy_language,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Registration failed")

      if (data.success) {
        setSuccess(true)
        localStorage.setItem("pendingVerificationEmail", formData.email)
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
        }, 2000)
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 bg-gradient-to-br from-teal-50 to-white">
      <Card className="mx-auto w-full max-w-2xl border-2 border-teal-100 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="space-y-2 text-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex justify-center">
            <Image
              src="/right2thrive-logo.jpg"
              alt="Right2Thrive UK Logo"
              width={80}
              height={80}
              className="mb-2 rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">
            Join Right2Thrive
          </CardTitle>
          <CardDescription>
            Step {step} of 3: {step === 1 ? "Account Details" : step === 2 ? "Personal Profile" : "Well-being Check"}
          </CardDescription>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full bg-[#00990d]"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {success ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h3>
              <p className="text-gray-600 mb-6">Redirecting you to verification...</p>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert className="mb-6 bg-red-50 text-red-900 border-red-200" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" {...fadeIn} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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
                          className={errors.password ? "border-red-500" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div className="flex gap-1 h-1 mt-1">
                          {[1, 2, 3, 4, 5].map((l) => (
                            <div
                              key={l}
                              className={`flex-1 rounded-full transition-colors ${l <= passwordStrength
                                  ? (passwordStrength <= 2 ? 'bg-red-400' : passwordStrength <= 3 ? 'bg-yellow-400' : 'bg-green-500')
                                  : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                      {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" {...fadeIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label>1. What is your gender identity?</Label>
                      <Select
                        value={formData.gender_identity}
                        onValueChange={(val) => handleSelectChange("gender_identity", val)}
                      >
                        <SelectTrigger className={errors.gender_identity ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select identity" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDER_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gender_identity && <p className="text-xs text-red-500">{errors.gender_identity}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">2. How old are you?</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="13"
                        max="100"
                        value={formData.age}
                        onChange={handleChange}
                        className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>9. Which country are you in?</Label>
                        <Input
                          name="country"
                          placeholder="e.g. United Kingdom"
                          value={formData.country}
                          onChange={handleChange}
                          className={errors.country ? "border-red-500" : ""}
                        />
                        {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>10. Preferred therapy language?</Label>
                        <Input
                          name="preferred_therapy_language"
                          placeholder="e.g. English"
                          value={formData.preferred_therapy_language}
                          onChange={handleChange}
                          className={errors.preferred_therapy_language ? "border-red-500" : ""}
                        />
                        {errors.preferred_therapy_language && <p className="text-xs text-red-500">{errors.preferred_therapy_language}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>7. Do you currently go to school?</Label>
                      <Select
                        value={formData.school_status}
                        onValueChange={(val) => handleSelectChange("school_status", val)}
                      >
                        <SelectTrigger className={errors.school_status ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {SCHOOL_STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.school_status && <p className="text-xs text-red-500">{errors.school_status}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>8. Where do you currently live?</Label>
                      <Select
                        value={formData.living_situation}
                        onValueChange={(val) => handleSelectChange("living_situation", val)}
                      >
                        <SelectTrigger className={errors.living_situation ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select situation" />
                        </SelectTrigger>
                        <SelectContent>
                          {LIVING_SITUATION_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.living_situation && <p className="text-xs text-red-500">{errors.living_situation}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" {...fadeIn} className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base">3. What are the issues that you are facing?</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md custom-scrollbar">
                        {ISSUES_OPTIONS.map((issue) => (
                          <div key={issue} className="flex items-center space-x-2">
                            <Checkbox
                              id={`issue-${issue}`}
                              checked={formData.issues_facing.includes(issue)}
                              onCheckedChange={(checked) => handleCheckboxChange(issue, checked as boolean)}
                            />
                            <Label htmlFor={`issue-${issue}`} className="font-normal cursor-pointer">{issue}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.issues_facing && <p className="text-xs text-red-500">{errors.issues_facing}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>4. Have you ever been in therapy before?</Label>
                      <Select
                        value={formData.therapy_history}
                        onValueChange={(val) => handleSelectChange("therapy_history", val)}
                      >
                        <SelectTrigger className={errors.therapy_history ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select history" />
                        </SelectTrigger>
                        <SelectContent>
                          {THERAPY_HISTORY_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.therapy_history && <p className="text-xs text-red-500">{errors.therapy_history}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>5. How would you rate your relationship with your parents?</Label>
                      <RadioGroup
                        value={formData.relationship_with_parents}
                        onValueChange={(val) => handleSelectChange("relationship_with_parents", val)}
                        className="flex space-x-4"
                      >
                        {PARENT_RELATIONSHIP_OPTIONS.map(opt => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`rel-${opt}`} />
                            <Label htmlFor={`rel-${opt}`}>{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.relationship_with_parents && <p className="text-xs text-red-500">{errors.relationship_with_parents}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>6. When was the last time you thought about suicide?</Label>
                      <Select
                        value={formData.last_suicide_thought}
                        onValueChange={(val) => handleSelectChange("last_suicide_thought", val)}
                      >
                        <SelectTrigger className={errors.last_suicide_thought ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUICIDE_THOUGHTS_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.last_suicide_thought && <p className="text-xs text-red-500">{errors.last_suicide_thought}</p>}
                    </div>

                    <div className="flex items-start space-x-2 pt-4 border-t">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(c) => {
                          setFormData(p => ({ ...p, termsAccepted: c as boolean }))
                          if (errors.termsAccepted) setErrors(p => ({ ...p, termsAccepted: undefined }))
                        }}
                      />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        I agree to the <Link href="/terms" className="text-orange-600 underline">Terms of Service</Link> and <Link href="/privacy" className="text-orange-600 underline">Privacy Policy</Link>
                      </Label>
                    </div>
                    {errors.termsAccepted && <p className="text-xs text-red-500">{errors.termsAccepted}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div /> // Spacer
                )}

                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="bg-[#00990d] hover:bg-[#007a0b] text-white">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
        {step === 1 && (
          <CardFooter className="justify-center border-t py-4 bg-gray-50">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-orange-600 hover:text-teal-700">
                Sign in
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
