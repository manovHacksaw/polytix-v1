"use client"

import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"

export function StepNavigation({
  currentStep,
  isFirstStep,
  isLastStep,
  isValid,
  isSubmitting,
  onPrevious,
  onNext,
  contract,
  totalSteps,
  campaignType,
}) {
  // Determine the total number of steps based on campaign type
  const actualTotalSteps = totalSteps || (campaignType === "candidate" ? 4 : 5)

  return (
    <CardFooter className="flex justify-between border-t border-border/40 bg-muted/30 px-6 py-4">
      <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
        Previous
      </Button>
      <div className="text-sm text-muted-foreground">
        Step {currentStep} of {actualTotalSteps}
      </div>
      {isLastStep ? (
        <Button type="submit" disabled={!isValid || isSubmitting || !contract}>
          {isSubmitting ? "Creating..." : "Create Campaign"}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!isValid}>
          Next
        </Button>
      )}
    </CardFooter>
  )
}
