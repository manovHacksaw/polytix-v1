"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export default function CampaignCountdown({ endTime, className = "" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = endTime - now

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          percentage: 100,
        }
      }

      // Calculate time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      // Calculate percentage of time elapsed
      // Assuming 7 days is the max duration for visualization purposes
      const maxDuration = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      const elapsed = maxDuration - Math.min(difference, maxDuration)
      const percentage = Math.min(100, Math.max(0, (elapsed / maxDuration) * 100))

      return {
        days,
        hours,
        minutes,
        seconds,
        percentage,
      }
    }

    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Clean up the timer
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
      <Progress value={timeLeft.percentage} className="h-2" />
    </div>
  )
}
