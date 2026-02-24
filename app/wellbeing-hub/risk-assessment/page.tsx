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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { TextToSpeechButton } from "@/components/text-to-speech/TextToSpeechButton";

interface RiskQuestionOption {
  value: string;
  label: string;
  score: number;
}

interface RiskQuestion {
  id: string;
  question: string;
  type: "yes_no" | "radio" | "checkbox" | "scale";
  options: RiskQuestionOption[] | null;
  risk_weight: number;
  is_active: boolean;
  sort_order: number;
}

type RiskLevel = "low" | "moderate" | "high" | "critical";

interface RiskAssessmentResult {
  id: string;
  patient_id: number;
  therapist_id: number | null;
  score: number;
  risk_level: RiskLevel;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: number | null;
  created_at: string;
  updated_at: string;
  answers: Array<{
    id: string;
    risk_assessment_id: string;
    question_id: string;
    answer: string | number | string[];
    score: number;
    created_at: string;
    updated_at: string;
  }>;
  patient: { id: number; first_name: string; last_name: string };
  therapist: { id: number; first_name: string; last_name: string } | null;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Authorization: `Bearer ${token || ""}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function normalizeYesNoAnswer(val: unknown): "yes" | "no" | null {
  if (val === "yes" || val === "no") return val;
  if (val === true || val === "true" || val === 1 || val === "1") return "yes";
  if (val === false || val === "false" || val === 0 || val === "0")
    return "no";
  return null;
}

export default function RiskAssessmentPage() {
  const [questions, setQuestions] = useState<RiskQuestion[]>([]);
  const [answers, setAnswers] = useState<
    Record<string, string | number | string[] | null>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    if (!parsedUser.is_email_verified) {
      localStorage.setItem("pendingVerificationEmail", parsedUser.email);
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(parsedUser.email)}`
      );
      return;
    }

    const storedTherapistRaw = localStorage.getItem("therapist");
    let storedTherapist: { id?: number } | null = null;
    if (storedTherapistRaw) {
      try {
        storedTherapist = JSON.parse(storedTherapistRaw);
      } catch {
        // ignore
      }
    }
    if (!storedTherapist) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) storedTherapist = parsed.therapist;
        } catch {
          // ignore
        }
      }
    }
    if (storedTherapist?.id) {
      setSelectedTherapistId(storedTherapist.id);
    }
  }, [router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/patient/risk-questions`,
          { headers: getAuthHeaders() }
        );

        if (res.status === 401 || res.status === 302) {
          router.push("/auth/login");
          return;
        }

        const data = await res.json();

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "Failed to load risk questions");
        }

        setQuestions(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [router]);

  const currentQuestion = questions[currentQuestionIndex];

  const hasValidAnswer = (q: RiskQuestion): boolean => {
    const a = answers[q.id];
    if (a === null || a === undefined) return false;
    switch (q.type) {
      case "yes_no":
        return normalizeYesNoAnswer(a) !== null;
      case "radio":
        return typeof a === "string" && a.length > 0;
      case "checkbox":
        return Array.isArray(a) && a.length > 0;
      case "scale":
        return typeof a === "number" && !Number.isNaN(a);
      default:
        return false;
    }
  };

  const canProceed = currentQuestion ? hasValidAnswer(currentQuestion) : false;

  const handleYesNo = (val: "yes" | "no") => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleRadio = (val: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleCheckbox = (value: string, checked: boolean) => {
    if (!currentQuestion) return;
    const current = (answers[currentQuestion.id] as string[]) || [];
    let next: string[];
    if (checked) {
      next = [...current, value];
    } else {
      next = current.filter((v) => v !== value);
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }));
  };

  const handleScale = (val: number[]) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val[0] ?? 0 }));
  };

  const buildPayload = (): { question_id: string; answer: string | number | string[] }[] => {
    return questions
      .filter((q) => answers[q.id] !== null && answers[q.id] !== undefined)
      .map((q) => {
        let answer = answers[q.id];
        if (q.type === "yes_no") {
          answer = normalizeYesNoAnswer(answer) ?? "no";
        }
        return {
          question_id: q.id,
          answer: answer as string | number | string[],
        };
      });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload: {
        answers: { question_id: string; answer: string | number | string[] }[];
        therapist_id?: number;
      } = {
        answers: buildPayload(),
      };
      if (selectedTherapistId) {
        payload.therapist_id = selectedTherapistId;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/risk-assessments`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.message ||
          (data?.errors && typeof data.errors === "object"
            ? "Validation failed. Please check your answers."
            : "Failed to submit assessment");
        throw new Error(msg);
      }

      if (data.success && data.data?.assessment) {
        setResult(data.data.assessment);
      } else {
        throw new Error(data.message || "Unexpected response");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit assessment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  const riskLevelConfig: Record<
    RiskLevel,
    { label: string; color: string; bgColor: string }
  > = {
    low: {
      label: "Low",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    moderate: {
      label: "Moderate",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
    },
    high: {
      label: "High",
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
    critical: {
      label: "Critical",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
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

  if (error && !result) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md border-2 border-teal-100">
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-lg text-red-600 text-center">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/wellbeing-hub")}
            >
              Back to Wellbeing Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    const config = riskLevelConfig[result.risk_level] ?? riskLevelConfig.low;
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

        <Card className="mx-auto max-w-2xl border-2 border-teal-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Risk Assessment Completed
            </CardTitle>
            <CardDescription>
              Thank you for completing the risk assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md bg-gray-50 p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div
                  className={`rounded-full p-3 ${config.bgColor}`}
                >
                  <ShieldAlert className={`h-8 w-8 ${config.color}`} />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Assessment Submitted Successfully
              </h3>
              <p className="text-gray-600 mb-4">
                Your responses have been recorded. A healthcare professional
                will review your assessment and provide appropriate guidance.
              </p>

              <div
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${config.bgColor} ${config.color}`}
              >
                <span className="font-semibold">Risk Level:</span>
                <span>{config.label}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Score: {result.score}
              </p>
            </div>

            {(result.risk_level === "high" || result.risk_level === "critical") && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium">Important</p>
                <p>
                  Your responses indicate a higher level of concern. A member of
                  our team will reach out to you. If you need immediate support,
                  please contact a crisis helpline or go to your nearest
                  emergency department.
                </p>
              </div>
            )}

            <div className="rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
              <p className="font-medium">Confidentiality</p>
              <p>
                This assessment is confidential. Your responses are shared only
                with your care team to provide appropriate support.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push("/wellbeing-hub")}
              className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
            >
              Return to Wellbeing Hub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md border-2 border-teal-100">
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-lg text-gray-600 text-center">
              No risk assessment questions are available at this time.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/wellbeing-hub")}
            >
              Back to Wellbeing Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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

      <Card className="mx-auto max-w-2xl border-2 border-teal-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">
            Risk Assessment
          </CardTitle>
          <CardDescription>
            These questions help us understand your current wellbeing and provide
            appropriate support. All responses are confidential.
          </CardDescription>
          <Progress value={progress} className="h-2 w-full bg-gray-200" />
          <p className="mt-2 text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div className="text-lg font-medium text-[#ff961b] flex-1">
                {currentQuestion?.question}
              </div>
              <TextToSpeechButton
                text={currentQuestion?.question ?? ""}
                label="Listen to question"
                className="shrink-0"
              />
            </div>

            {currentQuestion?.type === "yes_no" && (
              <RadioGroup
                value={
                  normalizeYesNoAnswer(answers[currentQuestion.id]) ?? ""
                }
                onValueChange={(v) => handleYesNo(v as "yes" | "no")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 flex-1">
                  <RadioGroupItem value="yes" id="risk-yes" />
                  <Label htmlFor="risk-yes" className="cursor-pointer flex-grow">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 flex-1">
                  <RadioGroupItem value="no" id="risk-no" />
                  <Label htmlFor="risk-no" className="cursor-pointer flex-grow">
                    No
                  </Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion?.type === "radio" &&
              Array.isArray(currentQuestion.options) && (
                <RadioGroup
                  value={(answers[currentQuestion.id] as string) ?? ""}
                  onValueChange={handleRadio}
                  className="space-y-2"
                >
                  {currentQuestion.options.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={opt.value}
                        id={`risk-radio-${opt.value}`}
                      />
                      <Label
                        htmlFor={`risk-radio-${opt.value}`}
                        className="flex-grow cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

            {currentQuestion?.type === "checkbox" &&
              Array.isArray(currentQuestion.options) && (
                <div className="space-y-2">
                  {currentQuestion.options.map((opt) => {
                    const selected = (
                      (answers[currentQuestion.id] as string[]) ?? []
                    ).includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`risk-check-${opt.value}`}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            handleCheckbox(opt.value, !!checked)
                          }
                        />
                        <Label
                          htmlFor={`risk-check-${opt.value}`}
                          className="flex-grow cursor-pointer"
                        >
                          {opt.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

            {currentQuestion?.type === "scale" && (
              <div className="space-y-4 px-2">
                <Slider
                  value={[
                    typeof answers[currentQuestion.id] === "number"
                      ? (answers[currentQuestion.id] as number)
                      : 5,
                  ]}
                  onValueChange={handleScale}
                  min={1}
                  max={10}
                  step={1}
                />
                <p className="text-center text-sm text-gray-600">
                  {typeof answers[currentQuestion.id] === "number"
                    ? (answers[currentQuestion.id] as number)
                    : "5"}{" "}
                  / 10
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="bg-[#00990d] text-white hover:bg-[#3c362f]"
          >
            {currentQuestionIndex === questions.length - 1
              ? isSubmitting
                ? "Submitting..."
                : "Submit"
              : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
