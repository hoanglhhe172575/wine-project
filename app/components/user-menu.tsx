"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, History, ShoppingCart, Settings, LogOut } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { useCart } from "../contexts/cart-context"

export default function UserMenu() {
  const { state: authState, logout } = useAuth()
  const { state: cartState } = useCart()

  const handleLogout = () => {
    logout()
    alert("Đã đăng xuất thành công!")
  }

  if (!authState.isAuthenticated) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <User className="h-5 w-5" />
            <span>Tài khoản</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
          <Link href="/auth">
            <Button className="w-full bg-green-600 hover:bg-green-700">Đăng nhập / Đăng ký</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          {authState.user?.avatar ? (
            <Image
              src={authState.user.avatar || "/placeholder.svg"}
              alt={authState.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-green-700" />
            </div>
          )}
          <div>
            <p className="font-medium">{authState.user?.name}</p>
            <p className="text-sm text-gray-500">{authState.user?.email}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Order History */}
        <Link href="/orders">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <History className="mr-3 h-4 w-4" />
            <span>Lịch sử mua hàng</span>
          </Button>
        </Link>

        {/* Cart */}
        <Link href="/cart">
          <Button variant="outline" className="w-full justify-start bg-transparent relative">
            <ShoppingCart className="mr-3 h-4 w-4" />
            <span>Giỏ hàng của tôi</span>
            {cartState.itemCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartState.itemCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Settings */}
        <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
          <Settings className="mr-3 h-4 w-4" />
          <span>Cài đặt tài khoản</span>
        </Button>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </CardContent>
    </Card>
  )
}
