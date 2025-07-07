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
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"

const wineDetails = {
  3: {
    name: "Rượu Dâu Gia Đình",
    type: "Rượu Dâu",
    category: "Bình Dân",
    packaging: "Chai Nhựa 500ml",
    price: "55,000",
    rating: 4.4,
    image: "/images/strawberry-wine-family.jpg",
    description: "Rượu dâu tươi mát với hương vị ngọt ngào tự nhiên từ dâu tây tươi, phù hợp cho mọi gia đình.",
    details: {
      alcohol: "25%",
      ingredient: "Dâu tây tươi, đường cane, men rượu",
      aging: "Ủ 2 tháng",
      serving: "Uống lạnh hoặc pha với đá",
      pairing: "Bánh ngọt, trái cây, kem",
      volume: "500ml",
    },
    story:
      "Rượu dâu được làm từ dâu tây tươi ngon nhất, qua quá trình lên men tự nhiên tạo nên hương vị ngọt ngào đặc trưng. Sản phẩm có màu đỏ hồng đẹp mắt và hương thơm quyến rũ của dâu tây. Thích hợp cho những buổi tiệc gia đình hoặc thưởng thức cùng bạn bè.",
  },
  4: {
    name: "Rượu Dâu Premium",
    type: "Rượu Dâu",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh 500ml",
    price: "150,000",
    rating: 4.8,
    image: "/images/strawberry-wine-premium.jpg",
    description:
      "Rượu dâu cao cấp được đóng chai thủy tinh sang trọng, hoàn hảo cho những dịp đặc biệt và làm quà tặng.",
    details: {
      alcohol: "28%",
      ingredient: "Dâu tây organic, đường thốt nốt, men rượu cao cấp",
      aging: "Ủ 4 tháng",
      serving: "Uống lạnh trong ly rượu vang",
      pairing: "Chocolate, bánh kem, pho mát mềm",
      volume: "500ml",
    },
    story:
      "Phiên bản cao cấp của rượu dâu sử dụng dâu tây organic chất lượng cao và đường thốt nốt tự nhiên. Chai thủy tinh được thiết kế đặc biệt với nắp gỗ và lá trang trí, thích hợp làm quà tặng cho những người thân yêu. Hương vị tinh tế và cân bằng hoàn hảo với màu hồng đặc trưng quyến rũ.",
  },
  5: {
    name: "Rượu Nếp Cẩm Thường",
    type: "Rượu Nếp Cẩm",
    category: "Bình Dân",
    packaging: "Chai Nhựa 500ml",
    price: "50,000",
    rating: 4.2,
    image: "/images/purple-rice-wine-regular.jpg",
    description: "Rượu nếp cẩm với màu tím đặc trưng và hương vị thơm ngon, được chế biến từ nếp cẩm tự nhiên.",
    details: {
      alcohol: "30%",
      ingredient: "Nếp cẩm, men rượu truyền thống",
      aging: "Ủ 3 tháng",
      serving: "Uống ở nhiệt độ phòng",
      pairing: "Thịt kho, cá nướng, chả lụa",
      volume: "500ml",
    },
    story:
      "Rượu nếp cẩm được làm từ nếp cẩm tự nhiên có màu tím đẹp mắt. Quy trình sản xuất theo phương pháp truyền thống giúp giữ nguyên màu sắc và hương vị đặc trưng của nếp cẩm. Sản phẩm có giá cả phải chăng, phù hợp cho việc sử dụng thường xuyên.",
  },
  6: {
    name: "Rượu Nếp Cẩm Đặc Biệt",
    type: "Rượu Nếp Cẩm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh 750ml",
    price: "140,000",
    rating: 4.6,
    image: "/images/purple-rice-wine-special.jpg",
    description: "Rượu nếp cẩm cao cấp với màu sắc đẹp mắt, được đóng chai thủy tinh sang trọng.",
    details: {
      alcohol: "33%",
      ingredient: "Nếp cẩm hạt to, men rượu đặc biệt",
      aging: "Ủ 5 tháng",
      serving: "Uống ở nhiệt độ phòng trong ly nhỏ",
      pairing: "Thịt nướng, hải sản, bánh chưng",
      volume: "750ml",
    },
    story:
      "Phiên bản cao cấp của rượu nếp cẩm sử dụng nếp cẩm hạt to chất lượng cao nhất. Thời gian ủ lâu hơn giúp hương vị trở nên đậm đà và phức tạp hơn. Chai thủy tinh được thiết kế đẹp mắt với dây trang trí màu tím đặc trưng và thiệp quà sang trọng, tạo nên sản phẩm quà tặng ý nghĩa.",
  },
  7: {
    name: "Rượu Cốm Gia Đình",
    type: "Rượu Cốm",
    category: "Bình Dân",
    packaging: "Chai Nhựa 500ml",
    price: "48,000",
    rating: 4.1,
    image: "/images/rice-wine-family.jpg",
    description: "Rượu cốm xanh với hương vị đặc trưng của cốm non tươi, mang đậm hương vị quê hương.",
    details: {
      alcohol: "27%",
      ingredient: "Cốm xanh tươi, men rượu tự nhiên",
      aging: "Ủ 2 tháng",
      serving: "Uống ở nhiệt độ phòng",
      pairing: "Bánh đậu xanh, chè, trái cây",
      volume: "500ml",
    },
    story:
      "Rượu cốm được chế biến từ cốm xanh tươi non, mang hương vị đặc trưng của mùa thu Hà Nội. Sản phẩm có màu xanh nhạt đẹp mắt và hương thơm dịu nhẹ của cốm. Đây là loại rượu truyền thống với giá cả bình dân, phù hợp cho mọi gia đình.",
  },
  8: {
    name: "Rượu Cốm Hảo Hạng",
    type: "Rượu Cốm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh 750ml",
    price: "135,000",
    rating: 4.5,
    image: "/images/rice-wine-premium.jpg",
    description: "Rượu cốm cao cấp được chế biến từ cốm xanh tươi nhất, đóng chai thủy tinh sang trọng.",
    details: {
      alcohol: "30%",
      ingredient: "Cốm xanh cao cấp, men rượu đặc biệt",
      aging: "Ủ 4 tháng",
      serving: "Uống ở nhiệt độ phòng trong ly nhỏ",
      pairing: "Bánh trung thu, trà xanh, bánh quy",
      volume: "750ml",
    },
    story:
      "Phiên bản cao cấp của rượu cốm sử dụng cốm xanh tươi nhất trong mùa, được chế biến theo quy trình đặc biệt để giữ nguyên hương vị tinh tế. Chai thủy tinh có màu xanh nhạt đặc trưng với nắp gỗ tự nhiên, tạo nên món quà tặng ý nghĩa cho những dịp đặc biệt.",
  },
  9: {
    name: "Rượu Mơ Truyền Thống",
    type: "Rượu Mơ",
    category: "Bình Dân",
    packaging: "Chai Nhựa 1L",
    price: "75,000",
    rating: 4.2,
    image: "/images/plum-wine-traditional.jpg",
    description: "Rượu mơ truyền thống với hương vị thơm ngon đặc trưng của trái mơ chín, giá cả phải chăng.",
    details: {
      alcohol: "26%",
      ingredient: "Mơ chín tự nhiên, đường cane, men rượu",
      aging: "Ủ 3 tháng",
      serving: "Uống lạnh hoặc ở nhiệt độ phòng",
      pairing: "Bánh tráng nướng, hạt điều, trái cây khô",
      volume: "1L",
    },
    story:
      "Rượu mơ được chế biến từ những trái mơ chín tự nhiên, có hương thơm đặc trưng và vị ngọt dịu. Sản phẩm có màu vàng nhạt đẹp mắt và hương vị tươi mát. Với giá cả phải chăng và dung tích lớn, thích hợp cho việc sử dụng gia đình.",
  },
  10: {
    name: "Rượu Mơ Đặc Biệt",
    type: "Rượu Mơ",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh 500ml",
    price: "165,000",
    rating: 4.9,
    image: "/images/plum-wine-special.jpg",
    description: "Rượu mơ cao cấp với hương vị thơm ngon đặc trưng, đóng chai thủy tinh sang trọng.",
    details: {
      alcohol: "30%",
      ingredient: "Mơ organic cao cấp, đường thốt nốt, men rượu đặc biệt",
      aging: "Ủ 6 tháng",
      serving: "Uống lạnh trong ly rượu vang",
      pairing: "Chocolate đen, bánh tart, pho mát cứng",
      volume: "500ml",
    },
    story:
      "Phiên bản cao cấp nhất của rượu mơ sử dụng mơ organic chất lượng cao và quy trình ủ lâu để tạo nên hương vị phức tạp và tinh tế. Chai thủy tinh có màu amber đẹp mắt với nhãn NETSAV đặc trưng và nắp gỗ tự nhiên, thích hợp làm quà tặng cho những dịp quan trọng. Đây là sản phẩm đạt rating cao nhất trong bộ sưu tập.",
  },
}

export default function WineDetailPage({ params }: { params: { id: string } }) {
  const { dispatch } = useCart()
  const wine = wineDetails[Number.parseInt(params.id) as keyof typeof wineDetails]

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const addToCart = () => {
    if (wine) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: Number.parseInt(params.id),
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
