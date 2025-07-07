"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import UserMenu from "../components/user-menu"

export default function ProfilePage() {
  const { state: authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/auth")
    }
  }, [authState.isAuthenticated, router])

  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
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

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Menu */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Chào mừng trở lại!</h2>
              <p className="text-gray-600 mb-6">Quản lý tài khoản và theo dõi đơn hàng của bạn một cách dễ dàng.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/orders">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Xem lịch sử mua hàng</Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
