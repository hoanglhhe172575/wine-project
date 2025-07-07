"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

const bannerSlides = [
  {
    id: 1,
    title: "Rượu Dâu Premium",
    subtitle: "Hương vị ngọt ngào từ thiên nhiên",
    description:
      "Rượu dâu cao cấp với màu hồng tự nhiên đặc trưng, được chế biến từ dâu tây tươi ngon nhất. Mang đến trải nghiệm thưởng thức tinh tế và đẳng cấp.",
    image: "/images/strawberry-wine-premium.jpg",
    color: "from-pink-600 to-red-600",
    productId: 4,
  },
  {
    id: 2,
    title: "Rượu Cốm Hảo Hạng",
    subtitle: "Hương vị mùa thu Hà Nội",
    description:
      "Rượu cốm cao cấp được chế biến từ cốm xanh tươi nhất, với màu xanh nhạt đặc trưng và hương vị tinh tế của mùa thu miền Bắc.",
    image: "/images/rice-wine-premium.jpg",
    color: "from-green-600 to-emerald-600",
    productId: 8,
  },
  {
    id: 3,
    title: "Rượu Nếp Cẩm Đặc Biệt",
    subtitle: "Màu tím quyến rũ",
    description:
      "Rượu nếp cẩm cao cấp với màu tím đậm đặc trưng và hương vị thơm ngon, được chế biến từ nếp cẩm hạt to chất lượng cao nhất.",
    image: "/images/purple-rice-wine-special.jpg",
    color: "from-purple-600 to-indigo-600",
    productId: 6,
  },
  {
    id: 4,
    title: "Rượu Mơ Đặc Biệt",
    subtitle: "Hương vị trái cây tự nhiên",
    description:
      "Rượu mơ cao cấp với màu amber đẹp mắt và hương thơm đặc trưng của mơ organic, mang đến cảm giác tươi mát và tinh tế.",
    image: "/images/plum-wine-special.jpg",
    color: "from-yellow-600 to-orange-600",
    productId: 10,
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleViewProduct = (productId: number) => {
    window.location.href = `/wine/${productId}`
  }

  const handleViewCollection = () => {
    window.location.href = "/products?category=Quà Tặng"
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Layout */}
          <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Content */}
            <div className={`relative flex items-center bg-gradient-to-r ${slide.color} opacity-95`}>
              <div className="max-w-xl mx-auto px-8 lg:px-12 text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                <h2 className="text-xl lg:text-2xl font-light mb-6 animate-fade-in-delay">{slide.subtitle}</h2>
                <p className="text-base lg:text-lg mb-8 leading-relaxed animate-fade-in-delay-2">{slide.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    onClick={() => handleViewProduct(slide.productId)}
                  >
                    Xem Chi Tiết
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                    onClick={handleViewCollection}
                  >
                    Xem Bộ Sưu Tập
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Product Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-80 h-96 lg:w-96 lg:h-[500px]">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority={index === 0}
                  />
                </div>
                {/* Decorative elements based on product type */}
                {slide.id === 1 && (
                  <>
                    <div className="absolute top-10 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-16 h-16 bg-pink-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  </>
                )}
                {slide.id === 2 && (
                  <>
                    <div className="absolute top-10 right-10 w-20 h-20 bg-green-200 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  </>
                )}
                {slide.id === 3 && (
                  <>
                    <div className="absolute top-10 right-10 w-20 h-20 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  </>
                )}
                {slide.id === 4 && (
                  <>
                    <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-16 h-16 bg-orange-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 z-10"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>

      {/* Product Info Overlay */}
      <div className="absolute bottom-20 left-8 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg z-10 max-w-xs">
        <h3 className="font-semibold text-lg mb-1">{bannerSlides[currentSlide].title}</h3>
        <p className="text-sm opacity-90">{bannerSlides[currentSlide].subtitle}</p>
        <div className="flex items-center mt-2 space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">Sản phẩm cao cấp</span>
        </div>
      </div>
    </div>
  )
}
