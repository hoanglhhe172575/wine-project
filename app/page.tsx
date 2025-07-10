"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import { useCart } from "./contexts/cart-context"
import { useProducts } from "./contexts/products-context"
import Navbar from "./components/navbar"
import HeroBanner from "./components/hero-banner"
import Footer from "./components/footer"
import ServicesSection from "./components/services-section"

export default function HomePage() {
  const { dispatch } = useCart()
  const { products } = useProducts()

  // Get featured wines (premium products)
  const featuredWines = products.filter((wine) => wine.category === "Quà Tặng").slice(0, 4)

  const addToCart = (wine: (typeof products)[0]) => {
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
