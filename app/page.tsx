"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import { useCart } from "./contexts/cart-context"
import Navbar from "./components/navbar"
import HeroBanner from "./components/hero-banner"
import Footer from "./components/footer"
import ServicesSection from "./components/services-section"

const wines = [
  {
    id: 3,
    name: "Set Rượu Dâu Gia Đình",
    type: "Rượu Dâu",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    price: "55,000",
    rating: 4.4,
    image: "/images/strawberry-wine-family.jpg",
    description: "Set rượu dâu tươi mát với hương vị ngọt ngào tự nhiên, giá cả phải chăng",
  },
  {
    id: 4,
    name: "Set Rượu Dâu Premium",
    type: "Rượu Dâu",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    price: "150,000",
    rating: 4.8,
    image: "/images/strawberry-wine-premium.jpg",
    description: "Set rượu dâu cao cấp được đóng chai thủy tinh đẹp mắt, hoàn hảo cho dịp đặc biệt",
  },
  {
    id: 5,
    name: "Set Rượu Nếp Cẩm Thường",
    type: "Rượu Nếp Cẩm",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    price: "50,000",
    rating: 4.2,
    image: "/images/purple-rice-wine-regular.jpg",
    description: "Set rượu nếp cẩm với màu tím đặc trưng, hương vị thơm ngon giá bình dân",
  },
  {
    id: 6,
    name: "Set Rượu Nếp Cẩm Đặc Biệt",
    type: "Rượu Nếp Cẩm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    price: "140,000",
    rating: 4.6,
    image: "/images/purple-rice-wine-special.jpg",
    description: "Set rượu nếp cẩm cao cấp với màu sắc đẹp mắt, đóng chai thủy tinh sang trọng",
  },
  {
    id: 7,
    name: "Set Rượu Cốm Gia Đình",
    type: "Rượu Cốm",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    price: "48,000",
    rating: 4.1,
    image: "/images/rice-wine-family.jpg",
    description: "Set rượu cốm xanh với hương vị đặc trưng của cốm non tươi, mang đậm hương vị quê hương",
  },
  {
    id: 8,
    name: "Set Rượu Cốm Hảo Hạng",
    type: "Rượu Cốm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    price: "135,000",
    rating: 4.5,
    image: "/images/rice-wine-premium.jpg",
    description: "Set rượu cốm cao cấp được chế biến từ cốm xanh tươi nhất, đóng chai thủy tinh sang trọng",
  },
  {
    id: 9,
    name: "Set Rượu Mơ Truyền Thống",
    type: "Rượu Mơ",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    price: "75,000",
    rating: 4.2,
    image: "/images/plum-wine-traditional.jpg",
    description: "Set rượu mơ truyền thống với hương vị thơm ngon đặc trưng, giá cả phải chăng",
  },
  {
    id: 10,
    name: "Set Rượu Mơ Đặc Biệt",
    type: "Rượu Mơ",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    price: "165,000",
    rating: 4.9,
    image: "/images/plum-wine-special.jpg",
    description: "Set rượu mơ cao cấp với hương vị thơm ngon đặc trưng, đóng chai thủy tinh sang trọng",
  },
]

const featuredWines = wines.filter((wine) => [4, 6, 8, 10].includes(wine.id))

export default function HomePage() {
  const { dispatch } = useCart()

  const addToCart = (wine: (typeof wines)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: wine.id,
        name: wine.name,
        price: wine.price,
        image: wine.image,
        type: wine.type,
      },
    })

    // Show success message
    alert(`Đã thêm ${wine.name} vào giỏ hàng!`)
  }

  const handleViewDetails = (wineId: number) => {
    // Scroll to top when navigating to detail page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Wine Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-xl text-gray-600">Những sản phẩm được yêu thích nhất</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWines.map((wine) => (
              <Card key={wine.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square relative bg-gray-100">
                  <Image src={wine.image || "/placeholder.svg"} alt={wine.name} fill className="object-contain p-4" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-center">{wine.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(wine.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">({wine.rating})</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-4">{wine.price}đ</div>
                  <Link href={`/wine/${wine.id}`} onClick={() => handleViewDetails(wine.id)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Xem Chi Tiết
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
