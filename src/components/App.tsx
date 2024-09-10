import React, { useState, useRef, useEffect } from 'react'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black vt323-regular">
      <div className="flex flex-row items-center justify-center space-x-4  mb-8">
        <h1 className="text-4xl font-bold text-[#4af626]">
          Turn Starknet Green
        </h1>
        <img src="/lss.png" alt="Loot Survivor" className="w-8" />
      </div>
      <p className="text-[#4af626] mb-2">
        Select your avatar and make it green
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 text-white"
        placeholder="Select your avatar"
      />
      {image && (
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[80vh] rounded-xl"
        />
      )}
    </div>
  )
}

export default App
