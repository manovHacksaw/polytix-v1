"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, LogOut, Wallet } from "lucide-react"
import { useContract } from "@/context/contract-context"
import { Toaster } from "sonner"

export function ConnectWallet() {
  const { connect, disconnect, address, isConnected, chainId, switchNetwork } = useContract()
 
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    try {
      await connect()
      toast.success("Wallet connected successfully!")
    } catch (error) {
      console.error("Connection error:", error)
      toast.error("Failed to connect wallet. Please try again.")
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.info("Disconnected from wallet.")
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork()
      toast.success("Successfully switched to Polygon AMOY!")
    } catch (error) {
      console.error("Network switch error:", error)
      toast.error("Failed to switch to Polygon AMOY Testnet.")
    }
  }

  // Handle server-side rendering
  if (!mounted) return <Button size="lg">Connect Wallet</Button>

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} variant="outline" size="lg">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const isWrongNetwork = chainId !== 80002

  if (isWrongNetwork) {
    return (
      <Button onClick={handleSwitchNetwork} variant="destructive" size="lg">
        Switch to Polygon AMOY
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg">
          <Wallet className="mr-2 h-4 w-4" />
          {address ? `${address.substring(0, 6)}...${address.substring(38)}` : "Connected"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}