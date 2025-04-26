import { NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"

// Pinata API keys - in production, these should be environment variables
const PINATA_API_KEY = process.env.PINATA_API_KEY || "221a8742fda0ee67a6ea"
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY || "ee788b80dd939458253f1419c01ab4d0fbaa74acb69767fcefaf870fcbfaef1d"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") 

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Create form data for Pinata
    const pinataFormData = new FormData()
    pinataFormData.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
    })

    // Set metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        app: "polytix-voting",
      },
    })
    pinataFormData.append("pinataMetadata", metadata)

    // Set options
    const options = JSON.stringify({
      cidVersion: 0,
    })
    pinataFormData.append("pinataOptions", options)

    // Upload to Pinata
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", pinataFormData, {
      maxBodyLength: Number.POSITIVE_INFINITY,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${pinataFormData.getBoundary()}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    })

    // Return the IPFS hash (CID)
    return NextResponse.json({
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    })
  } catch (error) {
    console.error("Error uploading to Pinata:", error)
    return NextResponse.json({ error: "Failed to upload file to IPFS" }, { status: 500 })
  }
}
