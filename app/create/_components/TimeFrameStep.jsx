"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";
import { Circle as InfoCircle } from "lucide-react";

export function TimeFrameStep({
  startTime,
  endTime,
  onChange,
  errors,
  validations,
  campaignType = "proposal"
}) {
  // Calculate minimum start time based on campaign type
  const calculateMinStartTime = () => {
    const minStart = new Date();
    if (campaignType === "candidate") {
      // For candidate-based, must be at least 30 minutes in the future
      minStart.setMinutes(minStart.getMinutes() + 30);
    } else {
      // For proposal-based, must be at least 10 minutes in the future
      minStart.setMinutes(minStart.getMinutes() + 10);
    }
    return format(minStart, "yyyy-MM-dd'T'HH:mm");
  };

  // Calculate minimum end time based on start time (must be at least 30 minutes after start time)
  const calculateMinEndTime = (startTime) => {
    if (!startTime) return calculateMinStartTime();
    const start = new Date(startTime);
    start.setMinutes(start.getMinutes() + 30);
    return format(start, "yyyy-MM-dd'T'HH:mm");
  };

  const minStartTimeStr = calculateMinStartTime();
  const minEndTimeStr = calculateMinEndTime(startTime);

  return (
    <>
      <StepDescription
        currentStep={4}
        totalSteps={5}
        title="Time Frame"
        description="Specify the exact start and end date/time for the voting period."
      />
      <CardContent className="p-6 space-y-6">
        {campaignType === "candidate" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-3 mb-4">
            <div className="flex gap-2">
              <InfoCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-amber-800 dark:text-amber-300 text-sm">
                <p className="font-medium">Candidate Registration Period</p>
                <p className="mt-1">
                  For candidate-based campaigns, voting can only start at least 30 minutes after creation to allow time for candidates to register.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="startTime" className="text-sm font-medium">
                Start Time (Your Local Time)
              </Label>
              <ValidationStatus isValid={validations.startTime} />
            </div>
            <Input
              id="startTime"
              name="startTime"
              type="datetime-local"
              min={minStartTimeStr}
              value={startTime}
              onChange={onChange}
              required
              className={`transition-all duration-150 ${
                errors.startTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                validations.startTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
              }`}
            />
            <ErrorMessage error={errors.startTime} />
            <p className="text-xs text-muted-foreground">
              {campaignType === "candidate" 
                ? "Must be at least 30 minutes from now to allow for candidate registration"
                : "Must be at least 10 minutes from now due to blockchain constraints"
              }
            </p>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="endTime" className="text-sm font-medium">
                End Time (Your Local Time)
              </Label>
              <ValidationStatus isValid={validations.endTime} />
            </div>
            <Input
              id="endTime"
              name="endTime"
              type="datetime-local"
              min={minEndTimeStr}
              value={endTime}
              onChange={onChange}
              required
              disabled={!startTime || !validations.startTime}
              className={`transition-all duration-150 ${
                errors.endTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                validations.endTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
              } ${(!startTime || !validations.startTime) ? 'cursor-not-allowed opacity-60' : ''}`}
            />
            <ErrorMessage error={errors.endTime} />
            <p className="text-xs text-muted-foreground">
              Must be at least 30 minutes after the start time.
            </p>
          </div>
        </div>

        {/* Time Summary */}
        {startTime && endTime && validations.startTime && validations.endTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-6"
          >
            <h4 className="text-sm font-medium mb-3 text-primary/90">Voting Period Summary:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium">STARTS</p>
                <p className="font-medium">{new Date(startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">ENDS</p>
                <p className="font-medium">{new Date(endTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </>
  );
}