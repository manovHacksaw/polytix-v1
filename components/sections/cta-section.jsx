"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
// import { SparklesCore } from "@/components/ui/sparkles"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">

      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to Transform Your Voting Process?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10"
          >
            Join the growing number of organizations using PolyTix for secure, transparent, and decentralized voting on
            the Polygon blockchain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700">
              <Link href="/create">Create Your First Campaign</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/campaigns">Explore Campaigns</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

