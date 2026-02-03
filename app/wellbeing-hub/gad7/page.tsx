"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenEarnedAcknowledgment } from "@/components/thrive-tokens/TokenEarnedAcknowledgment";

interface Question {
  id: number;
  question_text: string;
  order: number;
}

interface Option {
  value: number;
  label: string;
}

interface ScoreRange {
  min: number;
  max: number;
  severity: string;
  description: string;
}

interface AssessmentData {
  questions: Question[];
  options: Option[];
  title: string;
  description: string;
  instructions: string;
  max_score: number;
  score_ranges: ScoreRange[];
  therapist?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Therapist {
  id: number;
  name: string;
  email: string;
  gender: string;
  cultural_background: string;
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
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tokensEarned, setTokensEarned] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInitialSelection, setShowInitialSelection] = useState(true);

  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(false);

  const [selectedTherapistDetails, setSelectedTherapistDetails] =
    useState<TherapistDetails | null>(null);
  const [isLoadingTherapistDetails, setIsLoadingTherapistDetails] =
    useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTherapistLocked, setIsTherapistLocked] = useState(false);

  const router = useRouter();

  // Auth + set locked therapist from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }
    
    const parsedUser = JSON.parse(user);
    // Check if email is verified
    if (!parsedUser.is_email_verified) {
      localStorage.setItem("pendingVerificationEmail", parsedUser.email);
      router.push(`/auth/verify-email?email=${encodeURIComponent(parsedUser.email)}`);
      return;
    }
    
    setIsAuthenticated(true);

    // Try to read therapist from either `therapist` or `auth`
    const storedTherapistRaw = localStorage.getItem("therapist");
    let storedTherapist: any = null;

    if (storedTherapistRaw) {
      try {
        storedTherapist = JSON.parse(storedTherapistRaw);
      } catch {}
    }

    if (!storedTherapist) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) storedTherapist = parsed.therapist;
        } catch {}
      }
    }

    if (storedTherapist?.id) {
      setSelectedTherapist(String(storedTherapist.id));
      setIsTherapistLocked(true);
      // Preload therapist details view
      fetchTherapistDetails(String(storedTherapist.id));
    }
  }, [router]);

  // Fetch therapist list only if NOT locked
  useEffect(() => {
    if (isTherapistLocked) return; // skip listing when locked

    const fetchTherapists = async () => {
      setIsLoadingTherapists(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/therapists`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch therapists");
        }

        if (
          data.success &&
          data.data?.therapists &&
          Array.isArray(data.data.therapists)
        ) {
          setTherapists(data.data.therapists);
        } else {
          setTherapists([]);
          throw new Error(data.message || "Failed to fetch therapists");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load therapists"
        );
        setTherapists([]);
      } finally {
        setIsLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, [isTherapistLocked]);

  // Fetch standard questions by default
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch questions");
        }

        if (data.success) {
          setAssessmentData(data.data);
          setAnswers(Array(data.data.questions.length).fill(-1));
        } else {
          throw new Error(data.message || "Failed to fetch questions");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestion < (assessmentData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    // Submit on last question
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const formattedAnswers = assessmentData?.questions.reduce(
        (acc, _q, index) => {
          acc[index + 1] = answers[index];
          return acc;
        },
        {} as Record<number, number>
      );

      const requestBody = selectedTherapist
        ? {
            answers: formattedAnswers,
            therapist_id: parseInt(selectedTherapist),
          }
        : { answers: formattedAnswers };

      // Right before fetch
      console.log("SUBMIT PAYLOAD", {
        answers: formattedAnswers, // should be {1:0,2:1,...,7:3}
        therapist_id: selectedTherapist
          ? Number.parseInt(selectedTherapist)
          : undefined,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("SUBMIT RESPONSE", data);
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit assessment");
      }
      if (typeof data.data?.tokens_awarded === "number") {
        setTokensEarned(data.data.tokens_awarded);
      } else if (typeof data.tokens_awarded === "number") {
        setTokensEarned(data.tokens_awarded);
      }
      setShowResults(true);
    } catch (error) {
      console.log("SUBMIT ERROR", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit assessment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = () => {
    router.push("/wellbeing-hub");
  };

  const totalScore = answers.reduce(
    (sum, value) => (value >= 0 ? sum + value : sum),
    0
  );

  const getSeverityLevel = (score: number) => {
    if (!assessmentData) return { level: "", color: "bg-gray-500" };

    const range = assessmentData.score_ranges.find(
      (r) => score >= r.min && score <= r.max
    );
    if (!range) return { level: "", color: "bg-gray-500" };

    const colors: Record<string, string> = {
      "Minimal anxiety": "bg-green-500",
      "Mild anxiety": "bg-yellow-500",
      "Moderate anxiety": "bg-orange-500",
      "Severe anxiety": "bg-red-500",
    };

    return {
      level: range.severity,
      color: colors[range.severity] || "bg-gray-500",
      description: range.description,
    };
  };

  const severity = getSeverityLevel(totalScore);
  const progress = assessmentData
    ? ((currentQuestion + 1) / assessmentData.questions.length) * 100
    : 0;

  const fetchTherapistDetails = async (therapistId: string) => {
    setIsLoadingTherapistDetails(true);
    try {
      // Uses your endpoint: Route::get('/therapists/{id}', [TherapistController::class, 'getTherapist']);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${therapistId}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch therapist details");
      if (data.success) {
        setSelectedTherapistDetails(data.data.therapist);
      } else {
        throw new Error(data.message || "Failed to fetch therapist details");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load therapist details"
      );
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
    );
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
    );
  }

  if (!assessmentData) return null;

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
          <h1 className="mb-8 text-center text-3xl font-bold text-[#ff961b]">
            Choose Assessment Type
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* General Questions */}
            <Card
              className="cursor-pointer border-2 border-teal-100 transition-all hover:border-teal-300 hover:shadow-lg"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7`
                  );
                  const data = await response.json();
                  if (!response.ok)
                    throw new Error(
                      data.message || "Failed to fetch questions"
                    );

                  if (!data.success)
                    throw new Error(
                      data.message || "Failed to fetch questions"
                    );

                  setAssessmentData(data.data);
                  setAnswers(Array(data.data.questions.length).fill(-1));
                  setShowInitialSelection(false);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to load assessment"
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#ff961b]">
                  General Questions
                </CardTitle>
                <CardDescription>
                  Complete the standard GAD-7 assessment with general questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This version contains the standard GAD-7 questions used for
                  general anxiety screening.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Specific Therapist Questions */}
            <Card className="border-2 border-teal-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#ff961b]">
                  Specific Therapist Questions
                </CardTitle>
                <CardDescription>
                  Complete the GAD-7 assessment with questions tailored by your
                  therapist
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  This version includes additional questions selected by your
                  therapist based on your specific needs.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="therapist">Your Wellbeing Coach</Label>

                  {/* When locked: show a disabled select with the single therapist; otherwise show normal list */}
                  {isTherapistLocked ? (
                    <Select value={selectedTherapist} disabled>
                      <SelectTrigger
                        id="therapist"
                        className="w-full opacity-80"
                      >
                        <SelectValue placeholder="Therapist" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Display one fixed option */}
                        {selectedTherapistDetails ? (
                          <SelectItem value={selectedTherapist}>
                            {selectedTherapistDetails.first_name}{" "}
                            {selectedTherapistDetails.last_name}
                          </SelectItem>
                        ) : (
                          <SelectItem value={selectedTherapist}>
                            Selected therapist
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={selectedTherapist}
                      onValueChange={(value) => {
                        setSelectedTherapist(value);
                        if (value) fetchTherapistDetails(value);
                        else setSelectedTherapistDetails(null);
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
                        ) : !Array.isArray(therapists) ||
                          therapists.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No therapists available
                          </SelectItem>
                        ) : (
                          therapists.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              {t.name} - {t.cultural_background}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {isLoadingTherapistDetails && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Loading therapist details...
                  </div>
                )}

                {selectedTherapistDetails && !isLoadingTherapistDetails && (
                  <div className="mt-4 rounded-md border border-teal-100 bg-white p-4 shadow">
                    <h3 className="mb-4 text-xl font-bold text-[#ff961b]">
                      {selectedTherapistDetails.first_name}{" "}
                      {selectedTherapistDetails.last_name}
                    </h3>

                    <div className="mb-4">
                      <h4 className="text-md mb-2 font-semibold text-gray-800">
                        Contact Details
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedTherapistDetails.email || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">Telephone:</span>{" "}
                          {selectedTherapistDetails.profile?.telephone || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">Mobile:</span>{" "}
                          {selectedTherapistDetails.profile?.mobile || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">Address:</span>{" "}
                          {selectedTherapistDetails.profile?.address || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">Country:</span>{" "}
                          {selectedTherapistDetails.profile?.country || "N/A"}
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-md mb-2 font-semibold text-gray-800">
                        Background
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>
                          <span className="font-medium">Gender:</span>{" "}
                          {selectedTherapistDetails.profile?.gender || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">
                            Cultural Background:
                          </span>{" "}
                          {selectedTherapistDetails.profile
                            ?.cultural_background || "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">
                            Employment Status:
                          </span>{" "}
                          {selectedTherapistDetails.profile
                            ?.employment_status || "N/A"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-md mb-2 font-semibold text-gray-800">
                        Professional Summary
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>
                          <span className="font-medium">Qualifications:</span>{" "}
                          {selectedTherapistDetails.profile?.qualifications ||
                            "N/A"}
                        </li>
                        <li>
                          <span className="font-medium">Experience:</span>{" "}
                          {selectedTherapistDetails.profile?.experience ||
                            "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={async () => {
                    if (!selectedTherapist) return;

                    try {
                      setIsLoading(true);
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/gad7?therapist_id=${selectedTherapist}`
                      );
                      const data = await response.json();

                      if (!response.ok)
                        throw new Error(
                          data.message || "Failed to fetch questions"
                        );
                      if (!data.success)
                        throw new Error(
                          data.message || "Failed to fetch questions"
                        );

                      if (
                        !data.data.questions ||
                        data.data.questions.length === 0
                      ) {
                        throw new Error(
                          "Therapist has not set up any questions for the GAD-7 assessment. Please contact your wellbeing coach to set up the assessment questions."
                        );
                      }

                      setAssessmentData(data.data);
                      setAnswers(Array(data.data.questions.length).fill(-1));
                      setShowInitialSelection(false);
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Failed to load assessment"
                      );
                      setShowInitialSelection(true);
                    } finally {
                      setIsLoading(false);
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
    );
  }

  // Main assessment UI
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
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              {assessmentData.title}
            </CardTitle>
            <CardDescription>{assessmentData.description}</CardDescription>
            <Progress value={progress} className="h-2 w-full bg-gray-200" />
            <p className="mt-2 text-sm text-gray-500">
              Question {currentQuestion + 1} of{" "}
              {assessmentData.questions.length}
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
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`option-${option.value}`}
                    />
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="flex-grow cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1 || isSubmitting}
              className="bg-[#00990d] text-white hover:bg-[#3c362f]"
            >
              {currentQuestion === assessmentData.questions.length - 1
                ? isSubmitting
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mx-auto max-w-2xl border-2 border-teal-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Assessment Completed
            </CardTitle>
            <CardDescription>
              Thank you for completing the GAD-7 assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md bg-gray-50 p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Save className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Assessment Submitted Successfully
              </h3>
              <p className="text-gray-600">
                Your responses have been recorded. A healthcare professional
                will review your assessment and provide appropriate guidance.
              </p>
            </div>

            <TokenEarnedAcknowledgment tokensAwarded={tokensEarned} />

            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              <p className="font-medium">Important Note</p>
              <p>
                This assessment is a screening tool and not a diagnostic
                instrument. Please consult with a healthcare professional for a
                proper evaluation and diagnosis.
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
  );
}
