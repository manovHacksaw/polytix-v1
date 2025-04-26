"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { useContract } from "@/context/contract-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { DetailsStep } from "./DetailsStep" 
import { ConfigurationStep } from "./ConfigurationStep" 
import { TimeFrameStep } from "./TimeFrameStep" 
import { ProposalsStep } from "./ProposalsStep" 
import { StepNavigation } from "./StepNavigation" 
import { CampaignTypeStep } from "./CampaignTypeStep" 
import { useSubgraph } from "@/context/graphql/queries"

export default function CreateVoteForm() {
  const { contract } = useContract()
  const router = useRouter()
  const { events, refetchEvents, loading } = useSubgraph()
  

  const calculateStats = () => {
    if (!events?.campaignsCreated) return;

    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    
    // Get all unique campaign IDs
    const campaignIds = new Set(events.campaignsCreated.map(campaign => campaign.campaignId));
    const total = campaignIds.size;
    
    // Filter campaigns by status
    let active = 0;
    let upcoming = 0;
    let ended = 0;

    events.campaignsCreated.forEach(campaign => {
      const startTime = parseInt(campaign.startTime);
      const endTime = parseInt(campaign.endTime);
      
      if (now < startTime) {
        upcoming++;
      } else if (now > endTime) {
        ended++;
      } else {
        active++;
      }
    });

    // Also check for campaigns with changed status
    if (events.campaignStatusChanstatsged) {
      events.campaignStatusChanged.forEach(statusChange => {
        // Status 2 typically means ended or cancelled
        if (parseInt(statusChange.status) === 2) {
          // Decrease active count and increase ended count if this was an active campaign
          const campaign = events.campaignsCreated.find(c => c.campaignId === statusChange.campaignId);
          if (campaign) {
            const startTime = parseInt(campaign.startTime);
            const endTime = parseInt(campaign.endTime);
            if (now >= startTime && now <= endTime) {
              active--;
              ended++;
            }
          }
        }
      });
    }

    
  };

  const [formData, setFormData] = useState({
    campaignType: "proposal",
    description: "",
    restriction: "0",
    resultType: "0",
    startTime: "",
    endTime: "",
    maxVoters: "0",
    passKey: "",
    proposals: ["", ""],
  })

  const [errors, setErrors] = useState({
    description: "",
    startTime: "",
    endTime: "",
    maxVoters: "",
    passKey: "",
    proposals: "",
  })

  const [validations, setValidations] = useState({
    campaignType: true,
    description: false,
    startTime: false,
    endTime: false,
    proposals: false,
    maxVoters: true,
    passKey: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    validateForm()
  }, [formData])

  const validateForm = () => {
    const newErrors = { ...errors }
    const newValidations = { ...validations }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
      newValidations.description = false
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
      newValidations.description = false
    } else {
      newErrors.description = ""
      newValidations.description = true
    }

    // Time validation
    const now = new Date()
    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required"
      newValidations.startTime = false
    } else if (start < now) {
      newErrors.startTime = "Start time must be in the future"
      newValidations.startTime = false
    } else {
      newErrors.startTime = ""
      newValidations.startTime = true
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required"
      newValidations.endTime = false
    } else if (end <= start) {
      newErrors.endTime = "End time must be after start time"
      newValidations.endTime = false
    } else {
      newErrors.endTime = ""
      newValidations.endTime = true
    }

    // Max voters validation
    if (formData.restriction === "1" && (!formData.maxVoters || Number.parseInt(formData.maxVoters) <= 0)) {
      newErrors.maxVoters = "Maximum voters must be greater than 0"
      newValidations.maxVoters = false
    } else {
      newErrors.maxVoters = ""
      newValidations.maxVoters = true
    }

    // PassKey validation for registration-based campaigns
    if (formData.restriction === "2" && !formData.passKey.trim()) {
      newErrors.passKey = "Passkey is required for registration-based campaigns"
      newValidations.passKey = false
    } else {
      newErrors.passKey = ""
      newValidations.passKey = true
    }

    // Proposals validation (only for proposal-based campaigns)
    if (formData.campaignType === "proposal") {
      const validProposals = formData.proposals.filter((p) => p.trim().length > 0)
      if (validProposals.length < 2) {
        newErrors.proposals = "At least two proposals are required"
        newValidations.proposals = false
      } else {
        newErrors.proposals = ""
        newValidations.proposals = true
      }
    } else {
      // For candidate-based campaigns, proposals validation is not needed
      newErrors.proposals = ""
      newValidations.proposals = true
    }

    setErrors(newErrors)
    setValidations(newValidations)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProposalChange = (index, value) => {
    const newProposals = [...formData.proposals]
    newProposals[index] = value
    setFormData((prev) => ({
      ...prev,
      proposals: newProposals,
    }))
  }

  const addProposal = () => {
    if (formData.proposals.length < 10) {
      setFormData((prev) => ({
        ...prev,
        proposals: [...prev.proposals, ""],
      }))
    }
  }

  const removeProposal = (index) => {
    if (formData.proposals.length > 2) {
      const newProposals = formData.proposals.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        proposals: newProposals,
      }))
    }
  }

  const nextStep = () => {
    const maxSteps = formData.campaignType === "proposal" ? 5 : 4
    if (currentStep < maxSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      if (!contract) {
        throw new Error("Contract not initialized")
      }

      const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000)
      const maxVoters = formData.restriction === "1" ? Number.parseInt(formData.maxVoters) : 0

      let tx
      let campaignId

      if (formData.campaignType === "proposal") {
        // Use createProposalBasedCampaign from the contract
        tx = await contract.createProposalBasedCampaign(
          formData.description,
          Number.parseInt(formData.restriction),
          Number.parseInt(formData.resultType),
          startTimestamp,
          endTimestamp,
          maxVoters,
          formData.passKey || "",
          formData.proposals.filter((p) => p.trim().length > 0),
        )
      } else {
        // Use createCandidateBasedCampaign from the contract
        tx = await contract.createCandidateBasedCampaign(
          formData.description,
          Number.parseInt(formData.restriction),
          Number.parseInt(formData.resultType),
          startTimestamp,
          endTimestamp,
          maxVoters,
          formData.passKey || "",
        )
      }

      toast.promise(tx.wait(), {
        loading: "Creating voting campaign...",
        success: "Voting campaign created successfully!",
        error: "Failed to create voting campaign",
      })

      const receipt = await tx.wait()

      // Try to extract campaign ID from events
      try {
        // Find the CampaignCreated event in the receipt
        const event = receipt.logs.find(
          (log) => log.topics && log.topics[0] === contract.interface.getEventTopic("CampaignCreated"),
        )

        if (event) {
          const parsedLog = contract.interface.parseLog(event)
          campaignId = parsedLog.args.campaignId.toString()
        } else {
          // If we can't find the event, get the latest campaign count
          campaignId = (await contract.campaignCount()).toString()
        }
      } catch (error) {
        console.error("Error extracting campaign ID:", error)
        // Fallback: redirect to campaigns page
        router.push("/campaigns")
        return
      }

      // Reset form after successful submission
      setFormData({
        campaignType: "proposal",
        description: "",
        restriction: "0",
        resultType: "0",
        startTime: "",
        endTime: "",
        maxVoters: "0",
        passKey: "",
        proposals: ["", ""],
      })
      setCurrentStep(1)

      // Redirect to the newly created campaign page
      router.push(`/campaigns/${campaignId}`)
    } catch (error) {
      console.error("Error creating vote:", error)
      toast.error(error.message || "Failed to create voting campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      className="py-8 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-background/10 via-background/20 to-background/30 min-h-[80vh] rounded-lg backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <Alert className="mb-8 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 shadow-sm">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <AlertDescription className="text-amber-800 dark:text-amber-300 ml-2">
            <p className="font-medium">Ensure sufficient MATIC for gas fees.</p>
            <p className="text-sm mt-1">
              Voting campaign creation requires a transaction on the Polygon network, which consumes MATIC for gas.
              Obtain test MATIC from the{" "}
              <a
                href="https://faucet.polygon.technology/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
              >
                Polygon Faucet
              </a>{" "}
              if needed.
            </p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" {...fadeIn} transition={{ duration: 0.3 }}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <CampaignTypeStep
                    campaignType={formData.campaignType}
                    onChange={(value) => handleSelectChange("campaignType", value)}
                  />
                  <StepNavigation
                    currentStep={currentStep}
                    isFirstStep={true}
                    isLastStep={false}
                    isValid={true}
                    isSubmitting={isSubmitting}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    campaignType={formData.campaignType}
                  />
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" {...fadeIn} transition={{ duration: 0.3 }}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <DetailsStep
                    description={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    isValid={validations.description}
                  />
                  <StepNavigation
                    currentStep={currentStep}
                    isFirstStep={false}
                    isLastStep={false}
                    isValid={validations.description}
                    isSubmitting={isSubmitting}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    campaignType={formData.campaignType}
                  />
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" {...fadeIn} transition={{ duration: 0.3 }}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <ConfigurationStep
                    restriction={formData.restriction}
                    resultType={formData.resultType}
                    maxVoters={formData.maxVoters}
                    passKey={formData.passKey}
                    onRestrictionChange={(value) => handleSelectChange("restriction", value)}
                    onResultTypeChange={(value) => handleSelectChange("resultType", value)}
                    onMaxVotersChange={handleChange}
                    onPassKeyChange={handleChange}
                    error={errors.maxVoters || errors.passKey}
                    isValid={validations.maxVoters && validations.passKey}
                  />
                  <StepNavigation
                    currentStep={currentStep}
                    isFirstStep={false}
                    isLastStep={false}
                    isValid={validations.maxVoters && validations.passKey}
                    isSubmitting={isSubmitting}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    campaignType={formData.campaignType}
                  />
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" {...fadeIn} transition={{ duration: 0.3 }}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <TimeFrameStep
                    startTime={formData.startTime}
                    endTime={formData.endTime}
                    onChange={handleChange}
                    errors={{
                      startTime: errors.startTime,
                      endTime: errors.endTime,
                    }}
                    validations={{
                      startTime: validations.startTime,
                      endTime: validations.endTime,
                    }}
                  />
                  <StepNavigation
                    currentStep={currentStep}
                    isFirstStep={false}
                    isLastStep={formData.campaignType === "candidate"}
                    isValid={validations.startTime && validations.endTime}
                    isSubmitting={isSubmitting}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    contract={contract}
                    campaignType={formData.campaignType}
                  />
                </Card>
              </motion.div>
            )}

            {currentStep === 5 && formData.campaignType === "proposal" && (
              <motion.div key="step5" {...fadeIn} transition={{ duration: 0.3 }}>
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <ProposalsStep
                    proposals={formData.proposals}
                    onProposalChange={handleProposalChange}
                    onAddProposal={addProposal}
                    onRemoveProposal={removeProposal}
                    error={errors.proposals}
                    isValid={validations.proposals}
                    isSubmitting={isSubmitting}
                  />
                  <StepNavigation
                    currentStep={currentStep}
                    isFirstStep={false}
                    isLastStep={true}
                    isValid={validations.proposals}
                    isSubmitting={isSubmitting}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    contract={contract}
                    campaignType={formData.campaignType}
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  )
}
