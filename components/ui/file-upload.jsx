"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


export function FileUpload({
  className,
  onFileChange,
  onUploadComplete,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  value,
  isUploading = false,
  ...props
}) {
  const [preview, setPreview] = React.useState(value || null)

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0]
        onFileChange(file)

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  const clearFile = (e) => {
    e.stopPropagation()
    setPreview(null)
    onFileChange(null)
  }

  React.useEffect(() => {
    if (value) {
      setPreview(value)
    }
  }, [value])

  const hasError = fileRejections.length > 0
  const errorMessage = hasError
    ? fileRejections[0]?.errors[0]?.code === "file-too-large"
      ? `File is too large. Max size is ${maxSize / (1024 * 1024)}MB`
      : "Invalid file type"
    : null

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
          hasError && "border-destructive bg-destructive/5",
          preview && "p-2",
        )}
      >
        <input {...getInputProps()} />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-[200px] object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <UploadCloud className="w-10 h-10 mb-2 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. {maxSize / (1024 * 1024)}MB)</p>
          </div>
        )}
      </div>

      {errorMessage && <p className="mt-1 text-xs text-destructive">{errorMessage}</p>}
    </div>
  )
}
