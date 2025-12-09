'use client'

import { useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  initialImages: string[]
  name: string
}

// Compress image to reduce file size
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export function ImageUploader({ initialImages, name }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages || [])
  const [isDragging, setIsDragging] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    setIsCompressing(true)
    const filesArray = Array.from(files).slice(0, 4 - images.length)
    
    try {
      const compressedImages = await Promise.all(
        filesArray.map(async (file) => {
          if (images.length >= 4) return null
          if (!file.type.startsWith("image/")) return null

          // Compress image before adding
          return await compressImage(file)
        })
      )

      const validImages = compressedImages.filter((img): img is string => img !== null)
      setImages((prev) => [...prev, ...validImages])
    } catch (error) {
      console.error('Error compressing images:', error)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Hidden input for storing the JSON array */}
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {/* Current images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
                {image.startsWith("data:") ? (
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <Image src={image} alt={`Preview ${index + 1}`} fill className="object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-xs font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < 4 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={images.length >= 4}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop images here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isCompressing 
                  ? "Compressing images..." 
                  : `Upload ${4 - images.length} more image${4 - images.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
