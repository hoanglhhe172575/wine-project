import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft } from "lucide-react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

const newsArticles = [
  {
    id: 1,
    title: "Du lịch, công tác Hà Nội - Mua gì làm quà?",
    excerpt:
      "Mê Tri - nơi quy địa yên đỗ phi nhiều màu mỡ, người dân sinh nghiệp trồng lúa tấm thơm. Gạo tấm thơm của làng ngon nức...",
    date: "Thứ Năm, 20/02/2025",
    image: "/placeholder.svg?height=300&width=400",
    category: "Du lịch",
  },
  {
    id: 2,
    title: "✨ Những ngày đầu vào mùa - Cùng thu hoạch lúa chín cùng Cốm Vân ✨",
    excerpt:
      "Từ những bông lúa trĩu cành trở thành những thức quà đẹo thơm, thật kì diệu phải không nhỉ? Sau một ngày được nhìn...",
    date: "Thứ Sáu, 14/06/2024",
    image: "/placeholder.svg?height=300&width=400",
    category: "Sản xuất",
  },
  {
    id: 3,
    title: "Rượu Cốm Sữa - Hương vị cốm non mộc mạc mà tinh tế của mùa thu Hà Nội",
    excerpt:
      "Rượu Cốm Sữa - Loại rượu với hương vị cốm non mộc mạc và thanh nhẹ. Rượu được nấu thủ công hoàn toàn từ gạo nế...",
    date: "Thứ Sáu, 14/06/2024",
    image: "/placeholder.svg?height=300&width=400",
    category: "Sản phẩm",
  },
  {
    id: 4,
    title: "Bí quyết chọn rượu cần chất lượng cho gia đình",
    excerpt:
      "Rượu cần truyền thống là thức uống không thể thiếu trong các bữa cơm gia đình Việt. Làm sao để chọn được chai rượu cần...",
    date: "Thứ Ba, 12/06/2024",
    image: "/placeholder.svg?height=300&width=400",
    category: "Hướng dẫn",
  },
  {
    id: 5,
    title: "Lễ hội rượu cần truyền thống - Nét đẹp văn hóa dân tộc",
    excerpt:
      "Lễ hội rượu cần không chỉ là dịp để thưởng thức những loại rượu ngon mà còn là cơ hội để tìm hiểu về văn hóa...",
    date: "Chủ Nhật, 09/06/2024",
    image: "/placeholder.svg?height=300&width=400",
    category: "Văn hóa",
  },
  {
    id: 6,
    title: "Quy trình sản xuất rượu nếp cẩm thủ công",
    excerpt:
      "Rượu nếp cẩm với màu tím đặc trưng được sản xuất theo quy trình thủ công truyền thống, giữ nguyên hương vị đậm đà...",
    date: "Thứ Sáu, 07/06/2024",
    image: "/placeholder.svg?height=300&width=400",
    category: "Sản xuất",
  },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </Link>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl font-bold text-green-600 text-center mb-4">Tin tức</h1>
        <p className="text-xl text-gray-600 text-center">Cập nhật những tin tức mới nhất về rượu truyền thống</p>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="aspect-[4/3] relative">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">{article.category}</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                <Link href={`/news/${article.id}`}>
                  <Button variant="outline" className="w-full bg-transparent hover:bg-green-50 hover:border-green-300">
                    Đọc thêm
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
