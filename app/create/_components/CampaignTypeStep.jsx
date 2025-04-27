"use client";

import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepDescription } from "./StepDescription";

export function CampaignTypeStep({ campaignType, onChange }) {
  return (
    <>
      <StepDescription
        currentStep={1}
        totalSteps={5}
        title="Campaign Type"
        description="Choose the type of voting campaign you want to create."
      />
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center">
            Campaign Type
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="right">
                  <p><strong>Proposal Based:</strong> Voters choose between predefined proposals. Good for decisions and referendums.</p>
                  <p><strong>Candidate Based:</strong> Candidates can register and present themselves. Suitable for elections.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <RadioGroup
            value={campaignType}
            onValueChange={onChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-card">
              <RadioGroupItem value="proposal" id="proposal" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="proposal" className="font-medium cursor-pointer">Proposal Based</Label>
                <p className="text-sm text-muted-foreground">Create a campaign with specific proposals for voters to choose from.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-card">
              <RadioGroupItem value="candidate" id="candidate" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="candidate" className="font-medium cursor-pointer">Candidate Based</Label>
                <p className="text-sm text-muted-foreground">Allow candidates to register and voters to elect from registered candidates.</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {campaignType === "candidate" && (
          <Alert variant="warning" className="mt-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-300 ml-2">
              <p className="font-medium">Important Information for Candidate-Based Voting:</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>Candidates must register themselves before the voting starts</li>
                <li>Each candidate needs to provide their name and a statement</li>
                <li>Registration period starts immediately after campaign creation</li>
                <li>Voting will start at least 30 minutes after creation to allow for candidate registration</li>
                <li>If you prefer to avoid the registration period, consider using proposal-based voting instead</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </>
  );
}