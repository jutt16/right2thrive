"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: number
  question_text: string
  order: number
}

interface Option {
  value: number
  label: string
}

interface ScoreRange {
  min: number
  max: number
  severity: string
  description: string
}

interface AssessmentData {
  questions: Question[]
  options: Option[]
  title: string
  description: string
  instructions: string
  max_score: number
  score_ranges: ScoreRange[]
  therapist?: {
    id: number
    first_name: string
    last_name: string
  }
}

interface Therapist {
  id: number
  name: string
  email: string
  gender: string
  cultural_background: string
}

interface TherapistProfile {
  id: number;
  user_id: string;
  date_of_birth: string | null;
  gender: string;
  cultural_background: string;
  telephone: string;
  mobile: string;
  employment_status: string;
  country: string;
  address: string;
  qualifications: string;
  experience: string;
  created_at: string;
  updated_at: string;
}

interface TherapistDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  is_super_admin: boolean;
  is_admin: boolean;
  is_therapist: boolean;
  is_approved: boolean;
  approved_by: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
  profile: TherapistProfile;
}

export default function GAD7Assessment() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showInitialSelection, setShowInitialSelection] = useState(true)
  const [selectedTherapist, setSelectedTherapist] = useState<string>("")
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(false)
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<TherapistDetails | null>(null)
  const [isLoadingTherapistDetails, setIsLoadingTherapistDetails] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoadingTherapists(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch therapists')
        }

        if (data.success && data.data?.therapists && Array.isArray(data.data.therapists)) {
          setTherapists(data.data.therapists)
        } else {
          setTherapists([])
          throw new Error(data.message || 'Failed to fetch therapists')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load therapists')
        setTherapists([])
      } finally {
        setIsLoadingTherapists(false)
      }
    }

    fetchTherapists()
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch questions')
        }

        if (data.success) {
          setAssessmentData(data.data)
          setAnswers(Array(data.data.questions.length).fill(-1))
        } else {
          throw new Error(data.message || 'Failed to fetch questions')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  const handleNext = async () => {
    if (currentQuestion < (assessmentData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit assessment when reaching the last question
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Authentication required')
        }

        // Format answers with sequential numbers from 1 to 7
        const formattedAnswers = assessmentData?.questions.reduce((acc, question, index) => {
          acc[index + 1] = answers[index]  // Use index + 1 to get numbers 1-7
          return acc
        }, {} as Record<number, number>)

        // Prepare request body based on assessment type
        const requestBody = selectedTherapist 
          ? {
              answers: formattedAnswers,
              therapist_id: parseInt(selectedTherapist)
            }
          : {
              answers: formattedAnswers
            }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        console.log("response",response)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit assessment')
        }

        if (data.success) {
          setShowResults(true)
        } else {
          throw new Error(data.message || 'Failed to submit assessment')
        }
      } catch (error) {
        console.error("Error submitting assessment:", error)
        setError(error instanceof Error ? error.message : 'Failed to submit assessment')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    router.push("/wellbeing-hub")
  }

  console.log("selectedTherapistDetails",selectedTherapistDetails)

  const totalScore = answers.reduce((sum, value) => (value >= 0 ? sum + value : sum), 0)

  const getSeverityLevel = (score: number) => {
    if (!assessmentData) return { level: "", color: "bg-gray-500" }
    
    const range = assessmentData.score_ranges.find(
      (range) => score >= range.min && score <= range.max
    )
    
    if (!range) return { level: "", color: "bg-gray-500" }

    const colors = {
      "Minimal anxiety": "bg-green-500",
      "Mild anxiety": "bg-yellow-500",
      "Moderate anxiety": "bg-orange-500",
      "Severe anxiety": "bg-red-500",
    }

    return { 
      level: range.severity, 
      color: colors[range.severity as keyof typeof colors] || "bg-gray-500",
      description: range.description
    }
  }

  const severity = getSeverityLevel(totalScore)
  const progress = assessmentData ? ((currentQuestion + 1) / assessmentData.questions.length) * 100 : 0

  const fetchTherapistDetails = async (therapistId: string) => {
    setIsLoadingTherapistDetails(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${therapistId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch therapist details');
      }

      if (data.success) {
        setSelectedTherapistDetails(data.data.therapist);
        console.log("data.data",data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch therapist details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load therapist details');
      setSelectedTherapistDetails(null);
    } finally {
      setIsLoadingTherapistDetails(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md border-2 border-teal-100">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-lg text-gray-600">Loading assessment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md border-2 border-teal-100">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-lg text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessmentData) return null

  if (showInitialSelection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 flex items-center text-[#ff961b]"
          onClick={() => router.push("/wellbeing-hub")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wellbeing Hub
        </Button>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-[#ff961b]">Choose Assessment Type</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="cursor-pointer border-2 border-teal-100 transition-all hover:border-teal-300 hover:shadow-lg"
              onClick={async () => {
                try {
                  setIsLoading(true)
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7`)
                  const data = await response.json()

                  if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch questions')
                  }

                  if (data.success) {
                    setAssessmentData(data.data)
                    setAnswers(Array(data.data.questions.length).fill(-1))
                    setShowInitialSelection(false)
                  } else {
                    throw new Error(data.message || 'Failed to fetch questions')
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to load assessment')
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#ff961b]">General Questions</CardTitle>
                <CardDescription>
                  Complete the standard GAD-7 assessment with general questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This version contains the standard GAD-7 questions used for general anxiety screening.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card 
              className="border-2 border-teal-100"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#ff961b]">Specific Therapist Questions</CardTitle>
                <CardDescription>
                  Complete the GAD-7 assessment with questions tailored by your therapist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  This version includes additional questions selected by your therapist based on your specific needs.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="therapist">Select Your Therapist</Label>
                  <Select
                    value={selectedTherapist}
                    onValueChange={(value) => {
                      setSelectedTherapist(value);
                      if (value) {
                        fetchTherapistDetails(value);
                      } else {
                        setSelectedTherapistDetails(null);
                      }
                    }}
                  >
                    <SelectTrigger id="therapist" className="w-full">
                      <SelectValue placeholder="Choose a therapist" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingTherapists ? (
                        <SelectItem value="loading" disabled>
                          Loading therapists...
                        </SelectItem>
                      ) : !Array.isArray(therapists) || therapists.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No therapists available
                        </SelectItem>
                      ) : (
                        therapists.map((therapist) => (
                          <SelectItem key={therapist.id} value={therapist.id.toString()}>
                            {therapist.name} - {therapist.cultural_background}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {isLoadingTherapistDetails && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Loading therapist details...
                  </div>
                )}

                {selectedTherapistDetails && !isLoadingTherapistDetails && (
                  <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-[#ff961b]">
                      {selectedTherapistDetails.first_name} {selectedTherapistDetails.last_name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {selectedTherapistDetails.email}
                      </p>
                      {/* <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span> {selectedTherapistDetails.is_approved ? 'Approved' : 'Pending Approval'}
                      </p> */}
                      {selectedTherapistDetails.profile && (
                        <>
                          {/* <p className="text-sm text-gray-600">
                            <span className="font-medium">Gender:</span> {selectedTherapistDetails.profile.gender}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Cultural Background:</span> {selectedTherapistDetails.profile.cultural_background}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Contact:</span> {selectedTherapistDetails.profile.mobile}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Employment Status:</span> {selectedTherapistDetails.profile.employment_status}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span> {selectedTherapistDetails.profile.address}, {selectedTherapistDetails.profile.country}
                          </p> */}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Qualifications:</span> {selectedTherapistDetails.profile.qualifications || 'Not specified'}
                          </p>
                          {/* <p className="text-sm text-gray-600">
                            <span className="font-medium">Experience:</span> {selectedTherapistDetails.profile.experience || 'Not specified'}
                          </p> */}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={async () => {
                    if (selectedTherapist) {
                      try {
                        setIsLoading(true)
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7?therapist_id=${selectedTherapist}`)
                        const data = await response.json()

                        if (!response.ok) {
                          throw new Error(data.message || 'Failed to fetch questions')
                        }

                        if (data.success) {
                          // Check specifically for empty questions array
                          if (!data.data.questions || data.data.questions.length === 0) {
                            throw new Error('Therapist has not set up any questions for the GAD-7 assessment. Please contact your therapist to set up the assessment questions.')
                          }
                          
                          console.log('Therapist specific questions:', data.data)
                          setAssessmentData(data.data)
                          setAnswers(Array(data.data.questions.length).fill(-1))
                          setShowInitialSelection(false)
                          setIsLoading(false) // Reset loading state after successful data load
                        } else {
                          throw new Error(data.message || 'Failed to fetch questions')
                        }
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Failed to load assessment')
                        setIsLoading(false)
                        setShowInitialSelection(true)
                      }
                    }
                  }}
                  disabled={!selectedTherapist}
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center text-[#ff961b]"
        onClick={() => router.push("/wellbeing-hub")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Wellbeing Hub
      </Button>

      {!showResults ? (
        <Card className="mx-auto max-w-2xl border-2 border-teal-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">{assessmentData.title}</CardTitle>
            <CardDescription>{assessmentData.description}</CardDescription>
            <Progress value={progress} className="h-2 w-full bg-gray-200" />
            <p className="mt-2 text-sm text-gray-500">
              Question {currentQuestion + 1} of {assessmentData.questions.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-lg font-medium text-[#ff961b]">
                {assessmentData.questions[currentQuestion].question_text}
              </div>
              <RadioGroup
                value={answers[currentQuestion].toString()}
                onValueChange={(value) => handleAnswer(Number.parseInt(value))}
              >
                {assessmentData.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1 || isSubmitting}
              className="bg-[#00990d] text-white hover:bg-[#3c362f]"
            >
              {currentQuestion === assessmentData.questions.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mx-auto max-w-2xl border-2 border-teal-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">Assessment Completed</CardTitle>
            <CardDescription>Thank you for completing the GAD-7 assessment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md bg-gray-50 p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Save className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">Assessment Submitted Successfully</h3>
              <p className="text-gray-600">
                Your responses have been recorded. A healthcare professional will review your assessment and provide appropriate guidance.
              </p>
            </div>

            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              <p className="font-medium">Important Note</p>
              <p>
                This assessment is a screening tool and not a diagnostic instrument. Please consult with a healthcare
                professional for a proper evaluation and diagnosis.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#00990d] text-white hover:bg-[#3c362f]"
            >
              {isSubmitting ? "Saving..." : "Return to Wellbeing Hub"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
