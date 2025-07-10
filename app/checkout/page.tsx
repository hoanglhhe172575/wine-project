"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, Phone, User, Mail } from "lucide-react"
import { useCart } from "../contexts/cart-context"
import { useAuth } from "../contexts/auth-context"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function CheckoutPage() {
  const { state: cartState, dispatch: cartDispatch, saveOrderToDatabase } = useCart()
  const { state: authState } = useAuth()
  const router = useRouter()

  const [orderData, setOrderData] = useState({
    name: authState.user?.name || "",
    email: authState.user?.email || "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cod",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push("/cart")
    }
  }, [cartState.items.length, router])

  // Redirect if not logged in
  useEffect(() => {
    if (!authState.isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán!")
      router.push("/auth")
    }
  }, [authState.isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  const getItemPrice = (priceString: string) => {
    return Number.parseInt(priceString.replace(/[.,]/g, ""))
  }

  const shippingFee = 30000
  const totalAmount = cartState.total + shippingFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderData.name || !orderData.email || !orderData.phone || !orderData.address) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setIsProcessing(true)

    try {
      // Create order object
      const order = {
        userId: authState.user?.id,
        items: cartState.items,
        customerInfo: orderData,
        total: totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      console.log("Submitting order:", order)

      // Save to database
      const success = await saveOrderToDatabase(order)

      if (success) {
        // Also save to localStorage as backup
        const existingOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
        existingOrders.push({
          ...order,
          id: Date.now().toString(),
        })
        localStorage.setItem("wine-orders", JSON.stringify(existingOrders))

        // Clear cart
        cartDispatch({ type: "CLEAR_CART" })

        alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.")
        router.push("/orders")
      } else {
        alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartState.items.length === 0) {
    return null
  }

  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/cart">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại giỏ hàng
          </Button>
        </Link>
      </div>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán đơn hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Thông tin khách hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={orderData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={orderData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={orderData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ giao hàng *
                    </label>
                    <Textarea
                      id="address"
                      name="address"
                      value={orderData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={orderData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Phương thức thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={orderData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="text-green-600"
                      />
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                      <input type="radio" name="paymentMethod" value="bank" disabled className="text-green-600" />
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-400">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-400">Tính năng đang phát triển</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">{formatPrice(getItemPrice(item.price) * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(cartState.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium text-sm">Thông tin giao hàng</span>
                  </div>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• Giao hàng trong 2-3 ngày làm việc</li>
                    <li>• Miễn phí giao hàng cho đơn từ 500,000đ</li>
                    <li>• Hỗ trợ đổi trả trong 7 ngày</li>
                  </ul>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Đặt hàng ngay
                    </>
                  )}
                </Button>

                {/* Contact Info */}
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Cần hỗ trợ?</p>
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>097 981 07 12</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>kisutaybac@gmail.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
