"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowRight, ChevronDown, ChevronRight, ShoppingCart } from "lucide-react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import { useProducts } from "../contexts/products-context"

const wineTypes = ["Rượu Cốm", "Rượu Dâu", "Rượu Nếp Cẩm", "Rượu Mơ"]

export default function ProductsPage() {
  const { products } = useProducts()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [selectedCategory, setSelectedCategory] = useState("Tất cả sản phẩm")
  const [selectedWineType, setSelectedWineType] = useState("")
  const [isAllProductsExpanded, setIsAllProductsExpanded] = useState(true)
  const [volumeFilter, setVolumeFilter] = useState("all")

  // Update page title when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory(`Kết quả tìm kiếm: "${searchQuery}"`)
      setSelectedWineType("")
    }
  }, [searchQuery])

  const filteredWines = products.filter((wine) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        wine.name.toLowerCase().includes(query) ||
        wine.type.toLowerCase().includes(query) ||
        wine.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory === "Quà Tặng") {
      if (wine.category !== "Quà Tặng") return false
    } else if (selectedCategory === "Tất cả sản phẩm") {
      if (selectedWineType && wine.type !== selectedWineType) return false
    }

    // Volume filter
    if (volumeFilter !== "all") {
      if (wine.volume !== volumeFilter) return false
    }

    return true
  })

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSelectedWineType("")
    if (category === "Tất cả sản phẩm") {
      setIsAllProductsExpanded(true)
    } else {
      setIsAllProductsExpanded(false)
    }
  }

  const handleWineTypeClick = (wineType: string) => {
    setSelectedCategory("Tất cả sản phẩm")
    setSelectedWineType(wineType)
  }

  const handleViewDetails = (wineId: number) => {
    // Scroll to top when navigating to detail page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`
    if (selectedWineType) return selectedWineType
    return selectedCategory
  }

  const getBreadcrumb = () => {
    if (searchQuery) return `Tìm kiếm: ${searchQuery}`
    if (selectedWineType) return selectedWineType
    return selectedCategory
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-green-600">{getBreadcrumb()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hide when searching */}
          {!searchQuery && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-green-600">
                    DANH MỤC SẢN PHẨM
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Tất cả sản phẩm - Main Category */}
                    <div>
                      <button
                        onClick={() => {
                          handleCategoryClick("Tất cả sản phẩm")
                          setIsAllProductsExpanded(!isAllProductsExpanded)
                        }}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategory === "Tất cả sản phẩm" && !selectedWineType
                            ? "bg-green-100 text-green-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>Tất cả sản phẩm</span>
                        {isAllProductsExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {/* Wine Type Subcategories */}
                      {isAllProductsExpanded && (
                        <div className="ml-4 mt-2 space-y-1">
                          {wineTypes.map((wineType) => (
                            <button
                              key={wineType}
                              onClick={() => handleWineTypeClick(wineType)}
                              className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                                selectedWineType === wineType
                                  ? "bg-green-50 text-green-600 font-medium"
                                  : "text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {wineType}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quà Tặng - Main Category */}
                    <button
                      onClick={() => handleCategoryClick("Quà Tặng")}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCategory === "Quà Tặng"
                          ? "bg-green-100 text-green-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Quà Tặng
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products */}
          <div className={searchQuery ? "lg:col-span-4" : "lg:col-span-3"}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-green-600">{getPageTitle()}</h1>
                {filteredWines.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">Tìm thấy {filteredWines.length} sản phẩm</p>
                )}
              </div>
              {!searchQuery && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Dung tích:</span>
                  <Select value={volumeFilter} onValueChange={setVolumeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="500ml">500ml</SelectItem>
                      <SelectItem value="750ml">750ml</SelectItem>
                      <SelectItem value="1L">1L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* No results message */}
            {filteredWines.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `Không có sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                    : "Không có sản phẩm nào trong danh mục này"}
                </p>
                <Link href="/products">
                  <Button className="bg-green-600 hover:bg-green-700">Xem tất cả sản phẩm</Button>
                </Link>
              </div>
            )}

            {/* Product Grid */}
            {filteredWines.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWines.map((wine) => (
                  <Card key={wine.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={wine.image || "/placeholder.svg"}
                        alt={wine.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      {wine.discount && <Badge className="absolute top-4 left-4 bg-red-500">-{wine.discount}%</Badge>}
                      <Badge className="absolute top-4 right-4 bg-blue-600">{wine.volume}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">{wine.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(wine.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({wine.rating})</span>
                      </div>
                      <div className="space-y-2">
                        {wine.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">{wine.originalPrice}đ</div>
                        )}
                        <div className="text-xl font-bold text-red-600">{wine.price}đ</div>
                      </div>
                      <Link href={`/wine/${wine.id}`} onClick={() => handleViewDetails(wine.id)}>
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                          Xem Chi Tiết
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredWines.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" disabled>
                    Trước
                  </Button>
                  <Button className="bg-green-600">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Sau</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-green-400 hover:bg-green-500 text-white rounded-full p-4 shadow-lg">
          <ShoppingCart className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">0</Badge>
        </Button>
      </div>
    </div>
  )
}
