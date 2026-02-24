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
import { TokenEarnedAcknowledgment } from "@/components/thrive-tokens/TokenEarnedAcknowledgment";
import { TextToSpeechButton } from "@/components/text-to-speech/TextToSpeechButton";
import { getApiUrl } from "@/lib/api-client";

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

export default function PHQ9Assessment() {
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
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");

  const router = useRouter();

  // Auth + set locked therapist from localStorage (same as GAD7)
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
    }
  }, [router]);

  // Fetch generic PHQ-9 questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          getApiUrl("/api/questions/phq9")
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

      // Map answers to 1..9 keys
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

      const response = await fetch(
        getApiUrl("/api/assessments/phq9"),
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
      "None-minimal depression": "bg-green-500",
      "Mild depression": "bg-yellow-500",
      "Moderate depression": "bg-orange-500",
      "Moderately severe depression": "bg-red-500",
      "Severe depression": "bg-red-600",
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

  // Main assessment UI (generic questions only)
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
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-medium text-[#ff961b] flex-1">
                  {assessmentData.questions[currentQuestion].question_text}
                </div>
                <TextToSpeechButton
                  text={assessmentData.questions[currentQuestion].question_text}
                  label="Listen to question"
                  className="shrink-0"
                />
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
              Thank you for completing the PHQ-9 assessment.
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
