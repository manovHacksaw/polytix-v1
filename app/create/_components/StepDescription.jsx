"use client";

import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StepDescription({ currentStep, totalSteps, title, description }) {
  return (
    <CardHeader className="space-y-1 bg-muted/30 border-b border-border/50">
      <Badge variant="secondary" className="w-fit mb-2">Step {currentStep} of {totalSteps}</Badge>
      <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}