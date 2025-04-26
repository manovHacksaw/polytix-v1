"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function CandidateList({ campaignId, contract, onVote, loading: parentLoading }) {
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  useEffect(() => {
    if (!contract || !campaignId) return

    const fetchCandidates = async () => {
      try {
        setLoading(true)

        const candidatesData = await contract.getCandidates(campaignId)

        // Format candidate data
        const formattedCandidates = []
        for (let i = 0; i < candidatesData.addresses.length; i++) {
          formattedCandidates.push({
            id: i,
            name: candidatesData.names[i],
            address: candidatesData.addresses[i],
          })
        }

        setCandidates(formattedCandidates)
      } catch (error) {
        console.error("Error fetching candidates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [contract, campaignId])

  const handleCandidateClick = (candidate) => {
    if (parentLoading) return
    setSelectedCandidate(candidate.id === selectedCandidate ? null : candidate.id)
  }

  const handleVote = () => {
    if (selectedCandidate !== null) {
      onVote(selectedCandidate)
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

  if (candidates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No candidates available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                selectedCandidate === candidate.id ? "border-primary ring-1 ring-primary" : ""
              }`}
              onClick={() => handleCandidateClick(candidate)}
            >
              <CardContent className="py-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatAddress(candidate.address)}</p>
                  </div>
                  {selectedCandidate === candidate.id && (
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
          disabled={parentLoading || selectedCandidate === null}
          className="w-full max-w-xs"
          size="lg"
        >
          {parentLoading
            ? "Processing..."
            : selectedCandidate !== null
              ? `Vote for ${candidates[selectedCandidate]?.name}`
              : "Select a candidate"}
        </Button>
      </div>
    </div>
  )
}
