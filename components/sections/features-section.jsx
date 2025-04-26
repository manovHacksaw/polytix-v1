"use client"

import { motion } from "framer-motion"
import { LampContainer } from "@/components/ui/lamp"
import { CardHoverEffect } from "@/components/ui/card-hover-effect"
import { ShieldCheck, Vote, Users, BarChart3, Clock, Lock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Secure Voting",
      description:
        "Blockchain-based voting ensures tamper-proof and transparent results that can be verified by anyone.",
      icon: <ShieldCheck className="h-10 w-10 text-violet-500" />,
    },
    {
      title: "Multiple Voting Types",
      description:
        "Support for various voting restrictions including open voting, limited participation, and registration-based voting.",
      icon: <Vote className="h-10 w-10 text-violet-500" />,
    },
    {
      title: "Customizable Campaigns",
      description:
        "Create campaigns with custom proposals, timeframes, and participation requirements to suit your needs.",
      icon: <Users className="h-10 w-10 text-violet-500" />,
    },
    {
      title: "Real-time Results",
      description: "View voting results in real-time with detailed analytics and transparent vote counting.",
      icon: <BarChart3 className="h-10 w-10 text-violet-500" />,
    },
    {
      title: "Timed Campaigns",
      description: "Set specific start and end times for your voting campaigns with automatic status updates.",
      icon: <Clock className="h-10 w-10 text-violet-500" />,
    },
    {
      title: "Decentralized Security",
      description: "Leverage Polygon's blockchain security to ensure votes cannot be altered or manipulated.",
      icon: <Lock className="h-10 w-10 text-violet-500" />,
    },
  ]

  return (
    <section className="py-20 overflow-hidden">
      <LampContainer>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-4"
        >
          Key Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
        >
          PolyTix provides a comprehensive suite of tools for creating and managing decentralized voting campaigns
        </motion.p>
      </LampContainer>

      <div className="container mx-auto px-4 mt-12">
        <CardHoverEffect items={features} />
      </div>
    </section>
  )
}

