"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProposalsStep({
  proposals,
  onProposalChange,
  onAddProposal,
  onRemoveProposal,
  error,
  isValid,
  isSubmitting
}) {
  const [focused, setFocused] = useState(null);

  return (
    <>
      <StepDescription
        currentStep={5}
        totalSteps={5}
        title="Proposals"
        description="Add the proposals that voters will choose between."
      />
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Proposals</Label>
            <ValidationStatus isValid={isValid} />
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {proposals.map((proposal, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-grow relative">
                    <Input
                      placeholder={`Proposal ${index + 1}`}
                      value={proposal}
                      onChange={(e) => onProposalChange(index, e.target.value)}
                      onFocus={() => setFocused(index)}
                      onBlur={() => setFocused(null)}
                      className={`pr-10 ${focused === index ? "ring-2 ring-primary/30" : ""} ${!proposal.trim() ? "border-red-200 focus:border-red-400" : ""}`}
                      maxLength={100}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none pointer-events-none">
                      {proposal.length}/100
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => onRemoveProposal(index)}
                    disabled={proposals.length <= 2 || isSubmitting}
                    className={`flex-shrink-0 ${proposals.length <= 2 ? "opacity-50 cursor-not-allowed" : "hover:text-red-500 hover:border-red-200"}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <ErrorMessage error={error} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddProposal}
            disabled={proposals.length >= 10 || isSubmitting}
            className={`w-full mt-2 ${proposals.length >= 10 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Proposal {proposals.length < 10 && `(${proposals.length}/10)`}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1 mt-4 bg-muted/40 p-3 rounded-md">
            <p className="font-medium">Guidelines:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>You must have at least 2 proposals</li>
              <li>Each proposal is limited to 100 characters</li>
              <li>You can have up to 10 proposals total</li>
              <li>Be clear and concise in your proposal descriptions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </>
  );
}