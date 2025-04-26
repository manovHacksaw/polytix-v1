"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ProposalList({ campaignId, contract, onVote, loading: parentLoading }) {
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState([])
  const [selectedProposal, setSelectedProposal] = useState(null)

  useEffect(() => {
    if (!contract || !campaignId) return

    const fetchProposals = async () => {
      try {
        setLoading(true)

        const proposalsData = await contract.getProposals(campaignId)

        // Format proposal data
        const formattedProposals = []
        for (let i = 0; i < proposalsData.contents.length; i++) {
          formattedProposals.push({
            id: i,
            content: proposalsData.contents[i],
          })
        }

        setProposals(formattedProposals)
      } catch (error) {
        console.error("Error fetching proposals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [contract, campaignId])

  const handleProposalClick = (proposal) => {
    if (parentLoading) return
    setSelectedProposal(proposal.id === selectedProposal ? null : proposal.id)
  }

  const handleVote = () => {
    if (selectedProposal !== null) {
      onVote(selectedProposal)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No proposals available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                selectedProposal === proposal.id ? "border-primary ring-1 ring-primary" : ""
              }`}
              onClick={() => handleProposalClick(proposal)}
            >
              <CardContent className="py-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Proposal {proposal.id + 1}</h3>
                    <p className="text-sm mt-2">{proposal.content}</p>
                  </div>
                  {selectedProposal === proposal.id && (
                    <div className="ml-4 flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={handleVote}
          disabled={parentLoading || selectedProposal === null}
          className="w-full max-w-xs"
          size="lg"
        >
          {parentLoading
            ? "Processing..."
            : selectedProposal !== null
              ? `Vote for Proposal ${selectedProposal + 1}`
              : "Select a proposal"}
        </Button>
      </div>
    </div>
  )
}
