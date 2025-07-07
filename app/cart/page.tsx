"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../contexts/cart-context"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  const getItemPrice = (priceString: string) => {
    return Number.parseInt(priceString.replace(/[.,]/g, ""))
  }

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

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

        {state.items.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700">Tiếp tục mua hàng</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cart Table */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Hình ảnh</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Tên sản phẩm</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Đơn giá</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Số lượng</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Thành tiền</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="w-20 h-20 relative">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.type}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-900">{item.price}đ</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-900">
                              {formatPrice(getItemPrice(item.price) * item.quantity)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="flex-1">
                <Link href="/products">
                  <Button variant="outline" className="bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tiếp tục mua hàng
                  </Button>
                </Link>
              </div>

              <Card className="w-full lg:w-auto lg:min-w-[400px]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Tổng tiền thanh toán:</span>
                      <span className="text-green-600">{formatPrice(state.total)}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-900">
                        TIẾP TỤC MUA HÀNG
                      </Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                        <Link href="/checkout">THANH TOÁN NGAY</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
