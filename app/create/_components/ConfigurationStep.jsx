"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";



export function ConfigurationStep({
  restriction,
  resultType,
  maxVoters,
  passKey,
  onRestrictionChange,
  onResultTypeChange,
  onMaxVotersChange,
  onPassKeyChange,
  error,
  isValid,
  campaignType = "proposal"
}) {
  return (
    <>
      <StepDescription
        currentStep={3}
        totalSteps={5}
        title="Voting Configuration"
        description="Define who can vote and how the results will be determined."
      />
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center">
            Voting Restriction
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="right">
                  {campaignType === "candidate" ? (
                    <p><strong>Registration Required:</strong> For candidate-based voting, registration is mandatory to ensure proper tracking of voters and candidates.</p>
                  ) : (
                    <>
                      <p><strong>Open to All:</strong> Any address can vote. Simple and public.</p>
                      <p><strong>Limited Number:</strong> Only the first 'X' voters can participate. Closes after limit is reached.</p>
                      <p><strong>Registration Required:</strong> Voters must register before the start time. Allows for controlled participation.</p>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Select 
            value={campaignType === "candidate" ? "2" : restriction} 
            onValueChange={onRestrictionChange}
            disabled={campaignType === "candidate"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select voting restriction" />
            </SelectTrigger>
            <SelectContent>
              {campaignType === "proposal" && (
                <>
                  <SelectItem value="0">Open to All</SelectItem>
                  <SelectItem value="1">Limited Number of Voters</SelectItem>
                </>
              )}
              <SelectItem value="2">Registration Required</SelectItem>
            </SelectContent>
          </Select>
          {campaignType === "candidate" && (
            <p className="text-xs text-muted-foreground mt-1">
              Registration is mandatory for candidate-based voting to ensure proper tracking of voters and candidates.
            </p>
          )}
        </div>

        <AnimatePresence>
          {(restriction === "1" || restriction === "2") && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: '1.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              {restriction === "1" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="maxVoters" className="text-sm font-medium">
                      Max Voters Limit
                    </Label>
                    <ValidationStatus isValid={isValid} />
                  </div>
                  <Input
                    id="maxVoters"
                    name="maxVoters"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter max voter count (e.g., 100)"
                    value={maxVoters}
                    onChange={onMaxVotersChange}
                    required
                    className={`transition-all duration-150 ${
                      error ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                      isValid ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                    }`}
                  />
                  <ErrorMessage error={error} />
                  <p className="text-xs text-muted-foreground">
                    The campaign will close to new voters once this number is reached.
                  </p>
                </div>
              )}

              {restriction === "2" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="passKey" className="text-sm font-medium">
                      Registration Passkey
                    </Label>
                    <ValidationStatus isValid={isValid} />
                  </div>
                  <Input
                    id="passKey"
                    name="passKey"
                    type="text"
                    placeholder="Enter passkey for registration"
                    value={passKey}
                    onChange={onPassKeyChange}
                    required
                    className={`transition-all duration-150 ${
                      error ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                      isValid ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                    }`}
                  />
                  <ErrorMessage error={error} />
                  <p className="text-xs text-muted-foreground">
                    {campaignType === "candidate" 
                      ? "This passkey will be required for both candidates and voters to register. Share it securely with all intended participants."
                      : "This passkey will be required for voters to register. Keep it secure and share it only with intended participants."
                    }
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-2 border-t border-border/30 mt-6">
          <Label className="text-sm font-medium flex items-center pt-4">
            Result Type
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="right">
                  <p><strong>Rank Based:</strong> Shows all {campaignType === "candidate" ? "candidates" : "proposals"} ordered by their vote count. Good for understanding overall preference.</p>
                  <p><strong>One Winner:</strong> Declares only the single {campaignType === "candidate" ? "candidate" : "proposal"} with the highest vote count as the winner.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <RadioGroup
            value={resultType}
            onValueChange={onResultTypeChange}
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="0" id="rank-based" />
              <Label htmlFor="rank-based" className="cursor-pointer font-normal">Rank Based</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="1" id="one-winner" />
              <Label htmlFor="one-winner" className="cursor-pointer font-normal">One Winner</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </>
  );
}