"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";

export function DetailsStep({
  name,
  description,
  onChange,
  errors = {},
  validations = {}
}) {
  return (
    <>
      <StepDescription
        currentStep={2}
        totalSteps={5}
        title="Campaign Details"
        description="Provide the essential information about your voting campaign."
      />
      <CardContent className="p-6 space-y-6">
        {/* Campaign Name */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="text-sm font-medium">
              Campaign Name
            </Label>
            <ValidationStatus isValid={validations.name} />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter campaign name (max 50 characters)"
            value={name}
            onChange={onChange}
            maxLength={50}
            required
            className={`transition-all duration-150 w-full ${
              errors.name ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
              validations.name ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
            }`}
          />
          <ErrorMessage error={errors.name} />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>A concise, descriptive name for your campaign.</span>
            <span className={name.length > 40 ? "text-amber-600 font-medium" : ""}>
              {name.length}/50
            </span>
          </div>
        </div>

        {/* Campaign Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-sm font-medium">
              Campaign Description
            </Label>
            <ValidationStatus isValid={validations.description} />
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter campaign description (10-100 characters)"
            value={description}
            onChange={onChange}
            maxLength={100}
            required
            rows={4}
            className={`transition-all duration-150 w-full ${
              errors.description ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
              validations.description ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
            }`}
          />
          <ErrorMessage error={errors.description} />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Provide details about the purpose and context of this voting campaign.</span>
            <span className={description.length > 90 ? "text-amber-600 font-medium" : ""}>
              {description.length}/100
            </span>
          </div>
        </div>
      </CardContent>
    </>
  );
}