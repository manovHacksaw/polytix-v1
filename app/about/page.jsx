"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useSubgraph } from "@/context/graphql/queries"
import { useEffect } from "react"

export default function AboutPage() {
  const {getAllEvents, events} = useSubgraph()
  useEffect(() => {
    const fetchData = async () => {
      await getAllEvents()
      console.log(events)
    }
    fetchData()
  }
  , [])
  console.log(events)
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About PolyTix</h1>
          <p className="text-muted-foreground mb-8">
            Learn about our mission to revolutionize voting through blockchain technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                PolyTix was created with a simple but powerful mission: to make voting more transparent, secure, and
                accessible through blockchain technology. We believe that by leveraging the power of decentralized
                systems, we can create voting solutions that are resistant to tampering and manipulation.
              </p>
              <p className="text-muted-foreground">
                Our platform enables organizations of all sizes to create and manage voting campaigns with confidence,
                knowing that the results are verifiable and immutable on the blockchain.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Why Blockchain?</h2>
              <p className="text-muted-foreground mb-4">
                Traditional voting systems often suffer from lack of transparency, potential for fraud, and limited
                accessibility. Blockchain technology addresses these issues by providing:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Immutable records that cannot be altered once recorded</li>
                <li>Transparent processes that can be verified by anyone</li>
                <li>Decentralized infrastructure that is resistant to censorship</li>
                <li>Secure voting mechanisms that protect voter privacy</li>
                <li>Global accessibility for participants regardless of location</li>
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4">The Technology Behind PolyTix</h2>
            <p className="text-muted-foreground mb-4">
              PolyTix is built on the Polygon blockchain, specifically the AMOY Testnet (Chain ID: 80002). We chose
              Polygon for its scalability, low transaction costs, and compatibility with Ethereum.
            </p>
            <p className="text-muted-foreground mb-4">
              Our smart contracts are written in Solidity and audited for security. The frontend is built using modern
              web technologies including Next.js, React, and Tailwind CSS, providing a seamless and responsive user
              experience.
            </p>
            <p className="text-muted-foreground">
              We use ethers.js to interact with the blockchain, ensuring reliable and efficient communication between
              our frontend and the smart contracts.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">DAOs & Communities</h3>
                <p className="text-muted-foreground">
                  Decentralized Autonomous Organizations can use PolyTix for governance decisions, proposal voting, and
                  community-driven initiatives.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Organizations & Clubs</h3>
                <p className="text-muted-foreground">
                  Non-profits, clubs, and organizations can conduct elections, make collective decisions, and vote on
                  budget allocations.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Project Governance</h3>
                <p className="text-muted-foreground">
                  Development teams can use PolyTix to vote on feature prioritization, roadmap decisions, and project
                  direction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </main>
  )
}

