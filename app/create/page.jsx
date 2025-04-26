"use client"


import { motion } from "framer-motion"
import CreateVoteForm from "./_components/CreateVoteForm"

export default function CreateCampaignPage() {
  return (
    <main className="min-h-screen">
      {/* <Navbar /> */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <h1 className="text-4xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground mt-2">
              Set up a new voting campaign with custom proposals, timeframes, and participation requirements.
            </p>
          </motion.div>
          <CreateVoteForm />
        </div>
      </div>
      {/* <Footer /> */}
    </main>
  )
}

