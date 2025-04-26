"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StepDescription } from "./StepDescription";
import { ErrorMessage } from "./ErrorMessage";
import { ValidationStatus } from "./ValidationStatus";



export function ProposalsStep({
  proposals,
  onProposalChange,
  onAddProposal,
  onRemoveProposal,
  error,
  isValid,
  isSubmitting
}) {
  return (
    <>
      <StepDescription
        currentStep={4}
        totalSteps={4}
        title="Proposals"
        description="Define the specific options voters can choose from. Minimum of 2 required."
      />
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h3 className="text-sm font-medium">Proposal Options</h3>
            <ValidationStatus isValid={isValid} />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddProposal}
            className="group"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, duration: 0.2 }}
              className="mr-2 flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </motion.div>
            Add Option
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {proposals.map((proposal, index) => (
              <motion.div
                key={`proposal-${index}`}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              >
                <Label
                  htmlFor={`proposal-${index}`}
                  className="text-sm font-medium text-muted-foreground w-8 text-right"
                >
                  {index + 1}.
                </Label>
                <Input
                  id={`proposal-${index}`}
                  placeholder={`Enter proposal option ${index + 1}`}
                  value={proposal}
                  onChange={(e) => onProposalChange(index, e.target.value)}
                  required
                  className={`flex-1 ${proposal.trim() === "" && error ? 'border-red-300' : ''}`}
                />
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveProposal(index)}
                        disabled={proposals.length <= 2 || isSubmitting}
                        className={`text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed ${proposals.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label={`Remove proposal ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    {proposals.length > 2 && <TooltipContent>Remove Option</TooltipContent>}
                    {proposals.length <= 2 && <TooltipContent>Minimum 2 proposals required</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <ErrorMessage error={error} />
      </CardContent>
    </>
  );
}