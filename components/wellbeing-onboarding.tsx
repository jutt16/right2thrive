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
import { Heart, Target, FileText, TrendingUp, ClipboardList, CheckCircle2, ArrowRight, X } from "lucide-react";

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

  useEffect(() => {
    // Always show the onboarding guide when the My Wellbeing page loads
    // (do not persist completion in localStorage so it appears on every login/visit)
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  }, []);

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

  if (!isOpen) return null;

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
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
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(e) => {
          // Allow ESC to close but mark as completed
          handleSkip();
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-full">
                <Heart className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  Welcome to Your Wellbeing Space! 🌟
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  Let's take a quick tour of your wellbeing options
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center ${
                  index < onboardingSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
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
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-8 border border-cyan-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-full shadow-md">
                {currentStepData.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentStepData.number}. {currentStepData.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                  {currentStepData.description}
                </p>
              </div>
            </div>
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

