import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <div className="relative">
      {/* Curved Top */}
      <div className="w-full overflow-hidden">
        <svg
          className="relative block w-full h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,120 C150,60 350,60 600,90 C850,120 1050,60 1200,90 L1200,120 Z" className="fill-green-300"></path>
        </svg>
      </div>

      <footer className="bg-green-300 text-gray-800 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo và thông tin liên hệ */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 relative rounded-full overflow-hidden border-4 border-green-600 shadow-lg">
                  <Image src="/images/logo.png" alt="NETSAV Northwest Logo" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800">NETSAY</h3>
                  <p className="text-sm text-gray-700">Northwest</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-green-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Hoa Lac, Thach That, Hanoi, Vietnam</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-700" />
                  <p className="text-sm font-semibold text-gray-800">0979 810 712</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-green-700" />
                  <p className="text-sm text-gray-700">kisutaybac@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Chính sách */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-800">CHÍNH SÁCH</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/policy/return" className="text-sm text-gray-700 hover:text-green-800 transition-colors">
                    Hoàn trả đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy/shipping"
                    className="text-sm text-gray-700 hover:text-green-800 transition-colors"
                  >
                    Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link href="/policy/privacy" className="text-sm text-gray-700 hover:text-green-800 transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/policy/terms" className="text-sm text-gray-700 hover:text-green-800 transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sản phẩm */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-800">SẢN PHẨM</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products?category=ruou-dau"
                    className="text-sm text-gray-700 hover:text-green-800 transition-colors"
                  >
                    Rượu Dâu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=ruou-nep-cam"
                    className="text-sm text-gray-700 hover:text-green-800 transition-colors"
                  >
                    Rượu Nếp Cẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=ruou-com"
                    className="text-sm text-gray-700 hover:text-green-800 transition-colors"
                  >
                    Rượu Cốm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=ruou-mo"
                    className="text-sm text-gray-700 hover:text-green-800 transition-colors"
                  >
                    Rượu Mơ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Liên hệ với chúng tôi */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-800">LIÊN HỆ VỚI CHÚNG TÔI</h4>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/NetSayy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors shadow-lg"
                  >
                    <Facebook className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://www.instagram.com/netsay.777/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 hover:bg-pink-700 p-3 rounded-full transition-colors shadow-lg"
                  >
                    <Instagram className="h-5 w-5 text-white" />
                  </a>                  
                </div>
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Theo dõi chúng tôi để cập nhật những sản phẩm mới nhất và ưu đãi đặc biệt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-green-400 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-700">
              © 2025 NETSAY Northwest. Dự án môn học - Chỉ dành cho mục đích giáo dục.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
