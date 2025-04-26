"use client"

// import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export const LampContainer = ({
  children,
  className,
}) => {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [isHovered, setIsHovered] = useState(false)
  

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseX.set(x)
      mouseY.set(y)
    }

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [mouseX, mouseY])

  const centerX = useTransform(mouseX, (val) => {
    if (!containerRef.current) return 0
    return val - containerRef.current.offsetWidth / 2
  })

  const centerY = useTransform(mouseY, (val) => {
    if (!containerRef.current) return 0
    return val - containerRef.current.offsetHeight / 2
  })

  console.log("containerRef:", containerRef);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden w-full rounded-md z-0",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div
            style={{
              x: useTransform(centerX, (val) => val / 4),
              y: useTransform(centerY, (val) => val / 4),
            }}
            className="absolute h-56 w-[600px] bg-violet-500 blur-[100px] opacity-20"
          />
        </div>

        <div className="relative z-20">{children}</div>
      </div>
    </div>
  )
}

