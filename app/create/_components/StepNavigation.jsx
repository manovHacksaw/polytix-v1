"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

export function StepNavigation({
  currentStep,
  isFirstStep,
  isLastStep,
  isValid,
  isSubmitting,
  onPrevious,
  onNext,
  campaignType
}) {
  const maxSteps = campaignType === "proposal" ? 5 : 4;
  
  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t border-border/50 p-6 bg-muted/30 gap-4">
      <div className="flex-1 w-full sm:w-auto">
        {!isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        ) : (
          <div className="hidden sm:block" /> // Empty div for alignment on first step
        )}
      </div>
      
      <div className="flex gap-2 items-center justify-center">
        {Array.from({ length: maxSteps }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 < currentStep
                ? "bg-primary w-6"
                : i + 1 === currentStep
                ? "bg-primary/80 w-8"
                : "bg-muted-foreground/30 w-2"
            }`}
            animate={{
              scale: i + 1 === currentStep ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: i + 1 === currentStep ? Infinity : 0,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </div>
      
      <div className="flex-1 w-full sm:w-auto text-right">
        {isLastStep ? (
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Create Campaign
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!isValid || isSubmitting}
            className="w-full sm:w-auto"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </CardFooter>
  );
}