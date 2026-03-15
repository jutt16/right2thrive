"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Target, FileText, TrendingUp, ClipboardList, CheckCircle2, ArrowRight, X, Compass } from "lucide-react";
import { getJourneyStages, getCurrentJourneyStage, setJourneyStage } from "@/lib/journey-stages-api";
import type { JourneyStage } from "@/lib/journey-stages-api";

interface OnboardingStep {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    number: 1,
    title: "My Weekly Goals",
    description: "Set and track your weekly wellbeing goals. Upload your goals and monitor your progress throughout the week to stay motivated and focused on your journey.",
    icon: <Target className="h-8 w-8 text-cyan-600" />,
  },
  {
    number: 2,
    title: "My Wellbeing Plan",
    description: "Access your personalized wellbeing plan tailored to your needs. This comprehensive plan helps guide your mental health journey with structured support.",
    icon: <FileText className="h-8 w-8 text-cyan-600" />,
  },
  {
    number: 3,
    title: "My Weekly Progress",
    description: "Track your weekly progress and see how far you've come. Review your achievements and identify areas where you can continue to grow.",
    icon: <TrendingUp className="h-8 w-8 text-cyan-600" />,
  },
  {
    number: 4,
    title: "Mental Health Assessments",
    description: "Complete various assessments including GAD-7 (anxiety), PHQ-9 (depression), SDQ (strengths and difficulties), and PCL-5 (PTSD). These help track your mental health and guide your care.",
    icon: <ClipboardList className="h-8 w-8 text-cyan-600" />,
  },
  {
    number: 5,
    title: "Additional Features",
    description: "Access your profile, view bookings, submit complaints, and explore the Wellbeing Hub for quick check-ins and assessments. Everything you need is just a click away!",
    icon: <CheckCircle2 className="h-8 w-8 text-cyan-600" />,
  },
];

export default function WellbeingOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [currentStage, setCurrentStage] = useState<JourneyStage | null>(null);
  const [stageLoading, setStageLoading] = useState(true);
  const [stageSaving, setStageSaving] = useState(false);

  useEffect(() => {
    // Always show the onboarding guide when the My Wellbeing page loads
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setStageLoading(false);
      return;
    }
    Promise.all([getJourneyStages(), getCurrentJourneyStage()])
      .then(([stageList, userStage]) => {
        setStages(stageList);
        setCurrentStage(userStage?.stage ?? null);
      })
      .catch(() => setStages([]))
      .finally(() => setStageLoading(false));
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  const handleSelectStage = async (stage: JourneyStage) => {
    setStageSaving(true);
    const result = await setJourneyStage(stage.id);
    setStageSaving(false);
    if ("error" in result) return;
    setCurrentStage(stage);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("journeyStageUpdated"));
    }
    handleNext();
  };

  if (!isOpen) return null;

  const isJourneyStageStep = currentStep === 0;
  const currentStepData = onboardingSteps[Math.max(0, currentStep - 1)]; // step 0 = journey, steps 1-5 = onboarding 0-4
  const isLastStep = currentStep === 5; // 6 steps total (0-5)
  const isFirstStep = currentStep === 0;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          // If user closes the dialog (click outside or ESC), mark as completed
          handleSkip();
        }
      }}
    >
      <DialogContent 
        className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[85dvh] sm:min-h-[32rem] sm:max-h-[92vh] overflow-hidden flex flex-col p-4 sm:p-6 !left-4 !right-4 !top-4 !bottom-4 !translate-x-0 !translate-y-0 sm:!left-[50%] sm:!top-[50%] sm:!translate-x-[-50%] sm:!translate-y-[-50%] [&>button.absolute]:hidden"
        onEscapeKeyDown={(e) => {
          // Allow ESC to close but mark as completed
          handleSkip();
        }}
      >
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 bg-cyan-50 rounded-full shrink-0">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">
                  Welcome to Your Wellbeing Space! 🌟
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                  Let&apos;s take a quick tour of your wellbeing options
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Step Indicator - step 0 = journey stage, steps 1-5 = feature tour */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 shrink-0">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`flex items-center ${index < 5 ? "flex-1 min-w-0" : ""}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all text-sm ${
                    index === currentStep
                      ? "bg-cyan-600 border-cyan-600 text-white scale-110"
                      : index < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 sm:p-8 border border-cyan-200">
            {isJourneyStageStep ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 sm:p-4 bg-white rounded-full shadow-md">
                    <Compass className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-3 sm:mt-4 mb-2">
                    Where are you in your journey?
                  </h3>
                  <p className="text-gray-600 max-w-xl text-sm sm:text-base">
                    The Transtheoretical Model helps us personalise your experience. Choose the stage that best describes where you are right now.
                  </p>
                </div>
                {stageLoading ? (
                  <p className="text-center text-gray-500">Loading…</p>
                ) : currentStage ? (
                  <div className="text-center">
                    <p className="text-lg font-medium text-cyan-700 mb-2">
                      You&apos;re at: <strong>{currentStage.name}</strong>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">{currentStage.description}</p>
                    <Button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : stages.length > 0 ? (
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {stages.map((stage) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => handleSelectStage(stage)}
                        disabled={stageSaving}
                        className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-cyan-500 hover:bg-white/80 transition-all bg-white"
                      >
                        <span className="font-semibold text-gray-800">{stage.name}</span>
                        <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <Button onClick={handleNext} variant="outline">
                    Skip for now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-white rounded-full shadow-md">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
                    {currentStepData.number}. {currentStepData.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-xl">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={isFirstStep ? "invisible" : ""}
            >
              Previous
            </Button>
            <div className="flex-1" />
            <Button
              onClick={handleNext}
              className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[120px]"
            >
              {isLastStep ? (
                <>
                  Got it! <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

