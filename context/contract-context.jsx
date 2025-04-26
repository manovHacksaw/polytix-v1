"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BLOCK_SCANNERS, chainName, CONTRACT_ADDRESS, currencyName, currencySymbol, POLYGON_AMOY_CHAIN_ID, RPC_URLS } from '@/lib/network';
import POLYTIX_ABI from '@/lib/abi'
import { toast } from 'sonner';

const ContractContext = createContext();

export function ContractProvider({ children }) {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [address, setAddress] = useState("")
    const [chainId, setChainId] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    // Initialize provider from window.ethereum if available
  useEffect(() => {
    
 const initProvider = async () => {
   
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Check if already connected
          const ethProvider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await ethProvider.listAccounts()

          if (accounts.length > 0) {
            const network = await ethProvider.getNetwork()
            const ethSigner = await ethProvider.getSigner()
            const ethContract = new ethers.Contract(CONTRACT_ADDRESS, POLYTIX_ABI, ethSigner)
  
            setProvider(ethProvider)
            setSigner(ethSigner)
            setContract(ethContract)
            setAddress(accounts[0].address)
            setChainId(Number(network.chainId))
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error initializing provider:", error)
        }
      }
    }

    initProvider()
  }, [])

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect()
        } else if (accounts[0] !== address) {
          // Account changed
          try {
            const ethProvider = new ethers.BrowserProvider(window.ethereum)
            const ethSigner = await ethProvider.getSigner()
            const ethContract = new ethers.Contract(CONTRACT_ADDRESS, POLYTIX_ABI, ethSigner)

            setProvider(ethProvider)
            setSigner(ethSigner)
            setContract(ethContract)
            setAddress(accounts[0])
            setIsConnected(true)

            toast.success("Account Changed", {
              description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
            })
          } catch (error) {
            console.error("Error handling account change:", error)
          }
        }
      }

      const handleChainChanged = async (chainIdHex) => {
        const newChainId = Number.parseInt(chainIdHex, 16)
        setChainId(newChainId)

        if (newChainId !== POLYGON_AMOY_CHAIN_ID) {
          toast.error("Wrong Network", {
            description: "Please switch to Polygon AMOY Testnet",
          })
        } else {
          // Reconnect on correct chain
          try {
            const ethProvider = new ethers.BrowserProvider(window.ethereum)
            const ethSigner = await ethProvider.getSigner()
            const ethContract = new ethers.Contract(CONTRACT_ADDRESS, POLYTIX_ABI, ethSigner)

            setProvider(ethProvider)
            setSigner(ethSigner)
            setContract(ethContract)

            toast.success("Network Changed", {
              description: "Connected to Polygon AMOY Testnet",
            })
          } catch (error) {
            console.error("Error handling chain change:", error)
          }
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address])

  const switchNetwork = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Try to switch to Polygon AMOY Testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }],
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`,
                  chainName: chainName,
                  nativeCurrency: {
                    name: currencyName,
                    symbol: currencySymbol,
                    decimals: 18,
                  },
                  rpcUrls: RPC_URLS,
                  blockExplorerUrls: BLOCK_SCANNERS,
                },
              ],
            })
          } catch (addError) {
            console.error("Error adding network:", addError)
            throw addError
          }
        } else {
          console.error("Error switching network:", switchError)
          throw switchError
        }
      }
    } else {
      toast.error("Wallet Not Found", {
        description: "Please install MetaMask or another Ethereum wallet",
      })
      throw new Error("No Ethereum wallet found")
    }
  }

  const connect = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum)

        // Request account access
        const accounts = await ethProvider.send("eth_requestAccounts", [])

        if (accounts.length === 0) {
          throw new Error("No accounts found")
        }

        const ethSigner = await ethProvider.getSigner()
        const network = await ethProvider.getNetwork()
        const currentChainId = Number(network.chainId)

        setProvider(ethProvider)
        setSigner(ethSigner)
        setAddress(accounts[0])
        setChainId(currentChainId)
        setIsConnected(true)

        // Create contract instance
        const ethContract = new ethers.Contract(CONTRACT_ADDRESS, POLYTIX_ABI, ethSigner)
        setContract(ethContract)

        // Check if on correct network
        if (currentChainId !== POLYGON_AMOY_CHAIN_ID) {
          toast.error("Wrong Network", {
            description: "Please switch to Polygon AMOY Testnet",
          })
        }

        return accounts[0]
      } catch (error) {
        console.error("Error connecting wallet:", error)
        throw error
      }
    } else {
      toast.error("Wallet Not Found", {
        description: "Please install MetaMask or another Ethereum wallet",
      })
      throw new Error("No Ethereum wallet found")
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAddress("")
    setChainId(null)
    setIsConnected(false)
  }

    const value = {
        contract,
        provider,  signer, isConnected, address, chainId, disconnect, switchNetwork, connect
    };

    return (
        <ContractContext.Provider value={value}>
            {children}
        </ContractContext.Provider>
    );
}

export function useContract() {
    const context = useContext(ContractContext);
    if (context === undefined) {
        throw new Error('useContract must be used within a ContractProvider');
    }
    return context;
}