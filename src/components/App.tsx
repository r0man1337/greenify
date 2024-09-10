import React, { useState, useRef, useEffect } from 'react'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        applyGreenFilter(ctx)
      }
      img.src = image
    }
  }, [image])

  const applyGreenFilter = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    )
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * 0.3 // Reduce red
      data[i + 2] = data[i + 2] * 0.3 // Reduce blue
    }
    ctx.putImageData(imageData, 0, 0)
  }

  // Add this new function to handle image download
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '')
      link.download = `${timestamp}-green-avatar.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black vt323-regular p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4af626] text-center">
          Turn Starknet Green
        </h1>
        <img src="/lss.png" alt="Loot Survivor" className="w-8" />
      </div>
      <p className="text-[#4af626] mb-4 text-center">
        Select your avatar and make it green
      </p>
      <div
        className={`w-full max-w-xs h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer mb-4 ${
          isDragging ? 'border-[#4af626] bg-[#4af62620]' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <p className="text-[#4af626] text-center px-4">
          {isDragging ? 'Drop image here' : 'Click or drag image here'}
        </p>
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && handleImageUpload(e.target.files[0])
        }
        className="hidden"
      />
      {image && (
        <>
          <canvas
            ref={canvasRef}
            className="w-full max-w-[500px] rounded-xl mb-4"
          />
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-[#4af626] text-black rounded hover:bg-[#3ad516] transition-colors"
          >
            Download
          </button>
        </>
      )}
    </div>
  )
}

export default App
