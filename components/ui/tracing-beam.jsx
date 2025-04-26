"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useTransform, useScroll, useVelocity, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export const TracingBeam = ({
  children,
  className,
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const contentRef = useRef(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])

  const yVelocity = useVelocity(y1)
  const smoothVelocity = useSpring(yVelocity, {
    damping: 50,
    stiffness: 400,
  })

  const opacity = useTransform(smoothVelocity, [-1000, 0, 1000], [0, 1, 0])

  return (
    <motion.div ref={ref} className={cn("relative", className)}>
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow: "0 0px 30px 6px rgba(124, 58, 237, 0.5)",
          }}
          className="relative flex h-full w-full"
        >
          <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="block" aria-hidden="true">
            <motion.path
              d={`M 1 0 V ${svgHeight} M 1 ${y1} H 12`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.2"
              strokeWidth="1.25"
              transition={{ duration: 0.1 }}
            />
            <motion.path
              d={`M 1 ${y2} H 12`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              transition={{ duration: 0.1 }}
            />
            <motion.path
              d={`M 1 ${y1} H 12`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              transition={{ duration: 0.1 }}
            />
          </svg>
          <motion.div
            style={{ opacity }}
            className="absolute left-[5.5px] top-[50px] h-4 w-4 rounded-full border border-violet-600 bg-white shadow-md"
          />
        </motion.div>
      </div>
      <div ref={contentRef} className="ml-4 md:ml-16 pt-10 pb-10">
        {children}
      </div>
    </motion.div>
  )
}

