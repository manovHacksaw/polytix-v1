"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterForm({ campaignId, restriction, onRegister, loading }) {
  const [passKey, setPassKey] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegister(passKey)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register to Vote</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {restriction === 2 && (
            <div className="space-y-2">
              <Label htmlFor="passKey">Pass Key</Label>
              <Input
                id="passKey"
                type="text"
                placeholder="Enter the pass key"
                value={passKey}
                onChange={(e) => setPassKey(e.target.value)}
                required={restriction === 2}
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            By registering, you will receive an NFT that represents your voting right for this campaign.
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
