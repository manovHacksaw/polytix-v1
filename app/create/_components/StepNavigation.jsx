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
    <CardFooter className="flex justify-between border-t border-border/50 p-6 bg-muted/30">
      <div>
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 items-center text-xs text-muted-foreground">
        {Array.from({ length: maxSteps }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i + 1 < currentStep
                ? "bg-primary"
                : i + 1 === currentStep
                ? "bg-primary/80"
                : "bg-muted-foreground/30"
            }`}
            animate={{
              scale: i + 1 === currentStep ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: i + 1 === currentStep ? Infinity : 0,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>
      
      <div>
      {isLastStep ? (
  <Button
    type="submit"
    disabled={!isValid || isSubmitting}
    className="bg-primary-gradient hover:bg-primary-gradient-hover"
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
  >
    Next
    <ChevronRight className="h-4 w-4 ml-2" />
  </Button>
)}

      </div>
    </CardFooter>
  );
}