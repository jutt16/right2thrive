"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useAuthStatus from "@/hooks/useAuthStatus";

interface HeroVariantProps {
  variant: "single" | "split";
  isAuthenticated: boolean;
}

export function HeroVariant({ variant, isAuthenticated }: HeroVariantProps) {
  if (variant === "single") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start w-full sm:w-auto">
        <Link href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"} className="w-full sm:w-auto">
          <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-300 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 text-lg sm:text-xl w-full sm:w-auto min-h-[56px]">
            {isAuthenticated ? "Access My Wellbeing Hub" : "Start Your Free Wellbeing Check"}
          </Button>
        </Link>
      </div>
    );
  }

  // Split variant (original with two buttons)
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start w-full sm:w-auto">
      <Link href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"} className="w-full sm:w-auto">
        <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-300 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-md transition duration-300 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 text-base sm:text-lg w-full sm:w-auto min-h-[48px]">
          {isAuthenticated ? "Access My Wellbeing Hub" : "Start Your Journey - Sign Up Free"}
        </Button>
      </Link>
      <Link href="#services" className="w-full sm:w-auto">
        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold px-6 py-3 sm:py-4 rounded-full transition duration-300 w-full sm:w-auto min-h-[48px] bg-transparent backdrop-blur-sm">
          Learn More
        </Button>
      </Link>
    </div>
  );
}

export function ABTestHero() {
  const [variant, setVariant] = useState<"single" | "split">("single");
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    // Simple A/B test logic - could be enhanced with proper analytics
    const testVariant = Math.random() < 0.5 ? "single" : "split";
    setVariant(testVariant);
    
    // Log the variant for analytics (in a real implementation)
    console.log(`Hero A/B Test - Variant: ${testVariant}`);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start w-full sm:w-auto">
      <HeroVariant variant={variant} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default ABTestHero;
