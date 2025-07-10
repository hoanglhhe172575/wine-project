"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Star, ArrowLeft, MapPin, Grape, Award, ShoppingCart } from "lucide-react"
import { useCart } from "../../contexts/cart-context"
import { useProducts } from "../../contexts/products-context"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"

export default function WineDetailPage({ params }: { params: { id: string } }) {
  const { dispatch } = useCart()
  const { getProductById } = useProducts()
  const wine = getProductById(Number.parseInt(params.id))

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const addToCart = () => {
    if (wine) {
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
      alert(`Đã thêm ${wine.name} vào giỏ hàng!`)
    }
  }

  if (!wine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/products">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về danh sách sản phẩm
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/products">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            <Image src={wine.image || "/placeholder.svg"} alt={wine.name} fill className="object-contain p-8" />
            <Badge className="absolute top-4 left-4 bg-amber-600 text-lg px-3 py-1">{wine.type}</Badge>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{wine.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{wine.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{wine.rating}</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-6">{wine.description}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{wine.price}₫</div>
            </div>

            <Separator />

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Thông Số Kỹ Thuật</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-900">Độ cồn:</span>
                    <p className="text-gray-600">{wine.details.alcohol}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Thành phần:</span>
                    <p className="text-gray-600">{wine.details.ingredient}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Thời gian ủ:</span>
                    <p className="text-gray-600">{wine.details.aging}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Dung tích:</span>
                    <p className="text-gray-600">{wine.details.volume}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="font-medium text-gray-900">Cách thưởng thức:</span>
                  <p className="text-gray-600">{wine.details.serving}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Kết hợp với:</span>
                  <p className="text-gray-600">{wine.details.pairing}</p>
                </div>
              </CardContent>
            </Card>

            {/* Story */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Grape className="h-5 w-5" />
                  <span>Câu Chuyện Sản Phẩm</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{wine.story}</p>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div>
              <Button size="lg" onClick={addToCart} className="w-full bg-amber-600 hover:bg-amber-700">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
