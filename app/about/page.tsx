import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wine, Target, Users, TrendingUp, ArrowLeft, BookOpen, Award, Globe } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"


export default function AboutPage() {
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

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Về Dự Án Bán Rượu</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Dự án môn học tập trung vào việc nghiên cứu thị trường, phân tích khách hàng và xây dựng chiến lược kinh
            doanh cho sản phẩm rượu cao cấp.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Mục Tiêu Dự Án</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nghiên cứu và phát triển mô hình kinh doanh rượu cao cấp, tập trung vào chất lượng sản phẩm và trải
                  nghiệm khách hàng.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Đối Tượng Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Những người sành rượu, các nhà sưu tập và khách hàng có thu nhập cao đánh giá chất lượng và nguồn gốc
                  sản phẩm.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Chiến Lược Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Xây dựng thương hiệu cao cấp thông qua storytelling, trải nghiệm sản phẩm và kênh phân phối chọn lọc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Phân Tích Thị Trường Rượu Cao Cấp</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <BookOpen className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Nghiên Cứu Thị Trường</h4>
                    <p className="text-gray-600">
                      Phân tích xu hướng tiêu dùng rượu cao cấp tại Việt Nam và khu vực Đông Nam Á.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Award className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Chất Lượng Sản Phẩm</h4>
                    <p className="text-gray-600">
                      Tuyển chọn các loại rượu cao cấp từ những vùng sản xuất nổi tiếng trên thế giới.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mở Rộng Thị Trường</h4>
                    <p className="text-gray-600">Xây dựng kế hoạch mở rộng từ thị trường nội địa ra khu vực quốc tế.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Thống Kê Dự Án</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số loại rượu nghiên cứu:</span>
                  <span className="font-bold text-amber-600">15+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quốc gia xuất xứ:</span>
                  <span className="font-bold text-amber-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phân khúc giá:</span>
                  <span className="font-bold text-amber-600">Cao cấp</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian thực hiện:</span>
                  <span className="font-bold text-amber-600">1 học kỳ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nhóm Thực Hiện Dự Án</h3>
            <p className="text-xl text-gray-600">Dự án được thực hiện bởi nhóm sinh viên</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Thông Tin Dự Án</CardTitle>
              <CardDescription>Chi tiết về dự án môn học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-900">Môn học:</span>
                  <p className="text-gray-600">EXE</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Học kỳ:</span>
                  <p className="text-gray-600">2024-2025</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Khoa:</span>
                  <p className="text-gray-600">Software & Marketing</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Loại dự án:</span>
                  <p className="text-gray-600">Khởi nghiệp</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
