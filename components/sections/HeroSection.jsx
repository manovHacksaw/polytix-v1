"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { motion } from "framer-motion"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { ArrowRight, Vote, LineChart } from "lucide-react"

export function HeroSection() {
  const words = [
    {
      text: "Decentralized",
    },
    {
      text: "Voting",
    },
    {
      text: "on",
    },
    {
      text: "Polygon",
      className: "text-violet-500 dark:text-violet-400",
    },
  ]

  const features = [
    { 
      icon: <Vote className="h-5 w-5" />, 
      text: "Transparent Elections" 
    },
    { 
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21ZM16 7L8 7M16 11L8 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>, 
      text: "Tamper-Proof Ballots" 
    },
    { 
      icon: <LineChart className="h-5 w-5" />, 
      text: "Real-Time Results" 
    },
  ]

  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center z-10">
        {/* Typewriter header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <TypewriterEffect words={words} className="text-4xl md:text-6xl font-bold" />
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Create transparent, secure, and tamper-proof voting campaigns with PolyTix, powered by blockchain technology
          on the Polygon network.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm"
            >
              {feature.icon}
              <span>{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white transition-all duration-300"
          >
            <Link href="/create">
              Create Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 hover:bg-secondary/80 transition-all duration-300"
          >
            Explore Votes
          </Button>
          
          
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 w-full max-w-4xl mx-auto"
        >
          <div className="relative mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white/10 backdrop-blur-sm shadow-lg dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 via-transparent to-blue-500/30 opacity-30"></div>
            <div className="relative p-1">
              <img
                src="./dashboard.png"
                alt="PolyTix Dashboard Preview"
                className="rounded-lg shadow-md w-full h-auto"
              />
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 bg-black/70 text-white rounded-full px-3 py-1 text-xs backdrop-blur-sm">
                Live Demo
              </div>
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full px-3 py-1 text-xs font-medium">
                Powered by Polygon
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto w-full"
        >
          {[
            { value: "25K+", label: "Active Voters" },
            { value: "100+", label: "Campaigns Created" },
            { value: "0.001", label: "Avg. Gas Fee" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-600">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div> */}
      </div>
    </div>
  )
}