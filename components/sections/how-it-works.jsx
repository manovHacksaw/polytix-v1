"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, FileText, UserCheck, Vote, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react"

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])

  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Connect your MetaMask or other Ethereum wallet to the PolyTix platform to get started.",
      icon: <Wallet className="h-8 w-8" />,
      detailedDescription:
        "Securely connect your Ethereum wallet to access the PolyTix platform. We support MetaMask, WalletConnect, Coinbase Wallet, and other popular Web3 wallets.",
    },
    {
      title: "Create a Campaign",
      description: "Set up your voting campaign by defining proposals, voting restrictions, and timeframes.",
      icon: <FileText className="h-8 w-8" />,
      detailedDescription:
        "Define your campaign parameters including proposal options, voting eligibility criteria, campaign duration, and privacy settings. You can create public or token-gated campaigns.",
    },
    {
      title: "Register Voters",
      description: "For restricted campaigns, voters can register before the voting period begins.",
      icon: <UserCheck className="h-8 w-8" />,
      detailedDescription:
        "For private campaigns, manage your voter whitelist by adding wallet addresses or distributing special access NFTs. For public campaigns, anyone can participate.",
    },
    {
      title: "Cast Votes",
      description: "Participants vote for their preferred proposals during the active voting period.",
      icon: <Vote className="h-8 w-8" />,
      detailedDescription:
        "During the active voting period, eligible participants can cast their votes securely on the blockchain. Each vote is recorded transparently and cannot be altered.",
    },
    {
      title: "View Results",
      description: "Once voting ends, view the transparent and tamper-proof results on the blockchain.",
      icon: <BarChart3 className="h-8 w-8" />,
      detailedDescription:
        "After the voting period ends, results are automatically tallied and displayed. All votes are verifiable on the blockchain, ensuring complete transparency and trust.",
    },
  ]

  const handleStepClick = (index) => {
    setActiveStep(activeStep === index ? null : index)
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index])
    }
  }

  const handleTryDemo = () => {
    // Simulate completing all steps in sequence
    const timer = (index) => {
      setTimeout(() => {
        setActiveStep(index)
        if (!completedSteps.includes(index)) {
          setCompletedSteps((prev) => [...prev, index])
        }

        if (index < steps.length - 1) {
          timer(index + 1)
        }
      }, 1000)
    }

    setActiveStep(null)
    setCompletedSteps([])
    timer(0)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-muted/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 px-4 py-1 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300 text-sm font-medium"
          >
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-500 dark:from-violet-500 dark:to-indigo-300"
          >
            How PolyTix Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Follow these simple steps to create and participate in decentralized voting campaigns on the blockchain
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Button
              onClick={handleTryDemo}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            >
              Try Interactive Demo
            </Button>
          </motion.div>
        </div>

        <TracingBeam className="px-4">
          <div className="max-w-3xl mx-auto space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pb-12 last:pb-0"
              >
                {/* Timeline connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-14 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-violet-300 dark:from-violet-600 dark:to-violet-800" />
                )}

                <Card
                  className={`relative transition-all duration-300 ${
                    activeStep === index
                      ? "border-violet-500 shadow-lg shadow-violet-500/10"
                      : completedSteps.includes(index)
                        ? "border-green-500"
                        : "hover:border-violet-300 dark:hover:border-violet-700"
                  }`}
                >
                  <CardContent className="p-6">
                    <div
                      className="flex flex-col md:flex-row md:items-start gap-4 cursor-pointer"
                      onClick={() => handleStepClick(index)}
                    >
                      <div
                        className={`flex-shrink-0 relative flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 ${
                          activeStep === index
                            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                            : completedSteps.includes(index)
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-background border-2 border-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        {completedSteps.includes(index) ? (
                          <CheckCircle2 className="h-8 w-8" />
                        ) : (
                          <>
                            {step.icon}
                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3
                          className={`text-xl font-semibold mb-2 flex items-center ${
                            activeStep === index
                              ? "text-violet-600 dark:text-violet-400"
                              : completedSteps.includes(index)
                                ? "text-green-600 dark:text-green-400"
                                : ""
                          }`}
                        >
                          {step.title}
                          {activeStep === index && <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>

                        <AnimatePresence>
                          {activeStep === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t"
                            >
                              <p className="text-sm text-muted-foreground">{step.detailedDescription}</p>

                              <div className="mt-4 flex gap-2">
                                {index < steps.length - 1 ? (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStepClick(index + 1)
                                    }}
                                    className="bg-violet-600 hover:bg-violet-700 text-white"
                                  >
                                    Next Step
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveStep(null)
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Get Started
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TracingBeam>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
          >
            Launch Your First Campaign
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required. Get started in minutes.</p>
        </motion.div>
      </div>
    </section>
  )
}
