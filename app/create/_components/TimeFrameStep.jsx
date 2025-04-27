"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { StepDescription } from "./StepDescription";
import { ValidationStatus } from "./ValidationStatus";
import { ErrorMessage } from "./ErrorMessage";
import { Circle as InfoCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

export function TimeFrameStep({
  startTime,
  endTime,
  onChange,
  errors,
  validations,
  campaignType = "proposal"
}) {
  // State for separate date and time inputs
  const [startDate, setStartDate] = useState("");
  const [startTimeValue, setStartTimeValue] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTimeValue, setEndTimeValue] = useState("");

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
    return minStart;
  };

  // Calculate minimum end time based on start time (must be at least 30 minutes after start time)
  const calculateMinEndTime = (startTimeStr) => {
    if (!startTimeStr) return calculateMinStartTime();
    const start = new Date(startTimeStr);
    start.setMinutes(start.getMinutes() + 30);
    return start;
  };

  const minStartTime = calculateMinStartTime();
  const minStartDateStr = format(minStartTime, "yyyy-MM-dd");
  const minStartTimeStr = format(minStartTime, "HH:mm");
  
  const minEndTime = calculateMinEndTime(startTime);
  const minEndDateStr = format(minEndTime, "yyyy-MM-dd");
  const minEndTimeStr = format(minEndTime, "HH:mm");

  // Initialize date and time values from props on component mount
  useEffect(() => {
    if (startTime) {
      const date = new Date(startTime);
      setStartDate(format(date, "yyyy-MM-dd"));
      setStartTimeValue(format(date, "HH:mm"));
    }
    
    if (endTime) {
      const date = new Date(endTime);
      setEndDate(format(date, "yyyy-MM-dd"));
      setEndTimeValue(format(date, "HH:mm"));
    }
  }, []);

  // Combine date and time into ISO string and trigger parent onChange
  const handleDateTimeChange = (type, value, field) => {
    let currentDate, currentTime;
    
    if (type === "start") {
      currentDate = field === "date" ? value : startDate;
      currentTime = field === "time" ? value : startTimeValue;
      
      if (currentDate && currentTime) {
        const newDateTime = `${currentDate}T${currentTime}`;
        const customEvent = {
          target: {
            name: "startTime",
            value: newDateTime
          }
        };
        onChange(customEvent);
      }
      
      if (field === "date") setStartDate(value);
      if (field === "time") setStartTimeValue(value);
    } else {
      currentDate = field === "date" ? value : endDate;
      currentTime = field === "time" ? value : endTimeValue;
      
      if (currentDate && currentTime) {
        const newDateTime = `${currentDate}T${currentTime}`;
        const customEvent = {
          target: {
            name: "endTime",
            value: newDateTime
          }
        };
        onChange(customEvent);
      }
      
      if (field === "date") setEndDate(value);
      if (field === "time") setEndTimeValue(value);
    }
  };

  // Generate time options for select box (15 min intervals)
  const generateTimeOptions = (minTime = "00:00") => {
    const options = [];
    const [minHour, minMinute] = minTime.split(":").map(Number);
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Skip times before minimum time
        if (hour < minHour || (hour === minHour && minute < minMinute)) continue;
        
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        options.push(
          <SelectItem key={timeValue} value={timeValue}>
            {hour > 12 ? `${hour - 12}:${formattedMinute} PM` : hour === 12 ? `12:${formattedMinute} PM` : hour === 0 ? `12:${formattedMinute} AM` : `${hour}:${formattedMinute} AM`}
          </SelectItem>
        );
      }
    }
    
    return options;
  };

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

        <div className="grid grid-cols-1 gap-6 items-center max-w-2xl justify-center mx-auto">
          {/* Start Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="startTime" className="text-sm font-medium">
                Start Time (Your Local Time)
              </Label>
              <ValidationStatus isValid={validations.startTime} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-xs mb-1 block">Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={minStartDateStr}
                  value={startDate}
                  onChange={(e) => handleDateTimeChange("start", e.target.value, "date")}
                  required
                  className={`transition-all duration-150 ${
                    errors.startTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                    validations.startTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="startTime" className="text-xs mb-1 block">Time</Label>
                <Select 
                  value={startTimeValue} 
                  onValueChange={(value) => handleDateTimeChange("start", value, "time")}
                >
                  <SelectTrigger className={`transition-all duration-150 ${
                    errors.startTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                    validations.startTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                  }`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions(minStartTimeStr)}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="endDate" className="text-xs mb-1 block">Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={minEndDateStr}
                  value={endDate}
                  onChange={(e) => handleDateTimeChange("end", e.target.value, "date")}
                  required
                  disabled={!startTime || !validations.startTime}
                  className={`transition-all duration-150 ${
                    errors.endTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                    validations.endTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                  } ${(!startTime || !validations.startTime) ? 'cursor-not-allowed opacity-60' : ''}`}
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-xs mb-1 block">Time</Label>
                <Select 
                  value={endTimeValue} 
                  onValueChange={(value) => handleDateTimeChange("end", value, "time")}
                  disabled={!startTime || !validations.startTime}
                >
                  <SelectTrigger className={`transition-all duration-150 ${
                    errors.endTime ? "border-red-500 focus-visible:ring-red-500/50 shadow-inner shadow-red-500/10" :
                    validations.endTime ? "border-green-500 focus-visible:ring-green-500/50 shadow-inner shadow-green-500/10" : "focus-visible:ring-primary/50"
                  } ${(!startTime || !validations.startTime) ? 'cursor-not-allowed opacity-60' : ''}`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions(minEndTimeStr)}
                  </SelectContent>
                </Select>
              </div>
            </div>
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