"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";

export function DetailsStep({ description, onChange, error, isValid }) {
  return (
    <>
      <StepDescription
        currentStep={1}
        totalSteps={4}
        title="Campaign Details"
        description="Provide a clear and detailed description for your voting campaign."
      />
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-sm font-medium">
              Campaign Description
            </Label>
            <ValidationStatus isValid={isValid} />
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what this campaign is about in detail. What question are voters deciding on? Minimum 10 characters."
            value={description}
            onChange={onChange}
            required
            className={`min-h-32 transition-all duration-150 ${
              error ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
              isValid ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
            }`}
          />
          <ErrorMessage error={error} />
          <p className="text-xs text-muted-foreground mt-1">
            Clarity is key. Ensure voters understand the purpose and scope of the vote.
          </p>
        </div>
      </CardContent>
    </>
  );
}