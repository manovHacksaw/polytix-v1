"use client"

import React from "react"
import { cn } from "@/lib/utils"

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  as: Component = "div",
}) => {
  const containerRef = React.useRef(null)

  return (
    <Component className={cn("group relative p-[1px] overflow-hidden rounded-lg", containerClassName)}>
      <div
        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80 group-hover:opacity-100 blur-sm transition duration-500"
        style={{
          maskImage: "radial-gradient(farthest-side at 50% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(farthest-side at 50% 0%, black, transparent)",
        }}
      />
      <div
        ref={containerRef}
        className={cn("relative flex h-full w-full items-center justify-center rounded-lg bg-black", className)}
      >
        {children}
      </div>
    </Component>
  )
}

