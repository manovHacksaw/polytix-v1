"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Key, UserPlus, User, FileImage, MessageSquare, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function RegisterTab({
  campaignInfo,
  contract,
  campaignId,
  isConnected,
  connectWallet,
  onRegistrationSuccess,
}) {
  const [passKey, setPassKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [registrationType, setRegistrationType] = useState("voter")

  // Candidate registration fields
  const [candidateName, setCandidateName] = useState("")
  const [candidateStatement, setCandidateStatement] = useState("")
  const [candidateImage, setCandidateImage] = useState("")
  const [candidatePassKey, setCandidatePassKey] = useState("")
  const [imageUploading, setImageUploading] = useState(false)

  const handleRegisterAsVoter = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (campaignInfo.restriction === 2 && !passKey.trim()) {
      setError("Please enter the required passkey")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      // Call contract to register
      const tx = await contract.registerToVote(campaignId, passKey)
      await tx.wait()

      setSuccess("You have successfully registered for this campaign!")

      // Notify parent component
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error("Error registering:", err)
      setError("Failed to register. Please check your passkey and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setImageUploading(true)

      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload to our API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      // Use the IPFS hash returned from the API
      setCandidateImage(data.ipfsHash)
      toast.success("Image uploaded successfully to IPFS!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setImageUploading(false)
    }
  }

  const handleRegisterAsCandidate = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    // Validate inputs
    if (!candidateName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!candidateStatement.trim()) {
      setError("Please enter your statement")
      return
    }

    if (campaignInfo.restriction === 2 && !candidatePassKey.trim()) {
      setError("Please enter the required passkey")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      // Call contract to register as candidate
      const tx = await contract.registerAsCandidate(
        campaignId,
        candidateName,
        candidateStatement,
        candidateImage || "no-image", // Use a default if no image was uploaded
        candidatePassKey,
      )
      await tx.wait()

      setSuccess("You have successfully registered as a candidate for this campaign!")

      // Notify parent component
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error("Error registering as candidate:", err)
      setError("Failed to register as candidate. Please check your inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Connect Wallet to Register
          </CardTitle>
          <CardDescription>You need to connect your wallet to register for this campaign</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <UserPlus className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-6">Connect your wallet to register and participate in this campaign</p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Register for Campaign
        </CardTitle>
        <CardDescription>Register to participate in this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="voter" onValueChange={setRegistrationType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="voter">Register as Voter</TabsTrigger>
            {campaignInfo.votingType === 0 && ( // Only show for candidate-based campaigns
              <TabsTrigger value="candidate">Register as Candidate</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="voter">
            <div className="space-y-4">
              {campaignInfo.restriction === 2 && (
                <div className="space-y-2">
                  <Label htmlFor="passkey">Passkey</Label>
                  <div className="relative">
                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passkey"
                      type="password"
                      placeholder="Enter campaign passkey"
                      className="pl-9"
                      value={passKey}
                      onChange={(e) => setPassKey(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the passkey provided by the campaign creator to register.
                  </p>
                </div>
              )}

              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-medium mb-2">About Voter Registration</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• By registering, you will receive an NFT representing your voting right</li>
                  <li>• This NFT proves your eligibility to participate in this campaign</li>
                  <li>• Registration must be completed before voting begins</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {campaignInfo.votingType === 0 && (
            <TabsContent value="candidate">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-name">Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="candidate-name"
                      placeholder="Enter your name"
                      className="pl-9"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidate-statement">Why Vote For You?</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="candidate-statement"
                      placeholder="Share why people should vote for you"
                      className="pl-9 min-h-[120px]"
                      value={candidateStatement}
                      onChange={(e) => setCandidateStatement(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidate-image">Profile Image</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="relative"
                      disabled={imageUploading}
                      onClick={() => document.getElementById("image-upload").click()}
                    >
                      {imageUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileImage className="h-4 w-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {candidateImage && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <span>IPFS: {candidateImage.substring(0, 10)}...</span>
                        {candidateImage && (
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${candidateImage}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary ml-2 text-xs hover:underline"
                          >
                            View
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a profile image to represent you in the campaign (optional).
                  </p>
                </div>

                {campaignInfo.restriction === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="candidate-passkey">Passkey</Label>
                    <div className="relative">
                      <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="candidate-passkey"
                        type="password"
                        placeholder="Enter campaign passkey"
                        className="pl-9"
                        value={candidatePassKey}
                        onChange={(e) => setCandidatePassKey(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the passkey provided by the campaign creator to register.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">About Candidate Registration</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• By registering as a candidate, you'll be eligible to receive votes</li>
                    <li>• Your name and statement will be visible to all voters</li>
                    <li>• You'll also be registered as a voter automatically</li>
                    <li>• Candidate registration must be completed before voting begins</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={registrationType === "voter" ? handleRegisterAsVoter : handleRegisterAsCandidate}
          disabled={
            (registrationType === "voter" && campaignInfo.restriction === 2 && !passKey.trim()) ||
            (registrationType === "candidate" &&
              (!candidateName.trim() ||
                !candidateStatement.trim() ||
                (campaignInfo.restriction === 2 && !candidatePassKey.trim()))) ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {registrationType === "voter" ? "Registering..." : "Registering as Candidate..."}
            </>
          ) : registrationType === "voter" ? (
            "Register for Campaign"
          ) : (
            "Register as Candidate"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}