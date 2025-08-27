"use client"

import { useState } from 'react'
import Image from 'next/image'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
}

export function SafeImage({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  fill = false,
  width,
  height
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (imageError) {
    return null // Don't render anything if image fails to load
  }

  const handleError = () => {
    console.error("Failed to load image:", src)
    setImageError(true)
  }

  const handleLoad = () => {
    console.log("Image loaded successfully:", src)
    setImageLoaded(true)
  }

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 400}
      className={className}
      priority={priority}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}
