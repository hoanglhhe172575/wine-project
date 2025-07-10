"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Calendar, MapPin, Phone, Mail, RefreshCw } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

interface Order {
  id: string
  userId: string
  items: Array<{
    id: number
    name: string
    price: string
    image: string
    quantity: number
    type: string
  }>
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    notes: string
    paymentMethod: string
  }
  total: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!authState.isAuthenticated || !authState.user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/orders?userId=${authState.user.id}`)

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error("Failed to fetch orders")
        // Fallback to localStorage
        const savedOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
        const userOrders = savedOrders.filter((order: Order) => order.userId === authState.user?.id)
        setOrders(
          userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        )
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
      const userOrders = savedOrders.filter((order: Order) => order.userId === authState.user?.id)
      setOrders(
        userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [authState.isAuthenticated, authState.user?.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>
      case "confirmed":
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>
      case "shipping":
        return <Badge className="bg-purple-500">Đang giao hàng</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Đã giao hàng</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        // Refresh orders
        fetchOrders()
        alert("Đã hủy đơn hàng thành công!")
      } else {
        alert("Có lỗi xảy ra khi hủy đơn hàng!")
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      alert("Có lỗi xảy ra khi hủy đơn hàng!")
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h1>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
            <Link href="/auth">
              <Button className="bg-green-600 hover:bg-green-700">Đăng nhập</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang chủ
            </Button>
          </Link>
          <Button onClick={fetchOrders} variant="outline" className="mb-6 bg-transparent" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Orders Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mr-3" />
            <span>Đang tải đơn hàng...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700">Mua sắm ngay</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4" />
                          <span>{order.items.length} sản phẩm</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <div className="text-lg font-bold text-green-600 mt-2">{formatPrice(order.total)}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.type}</p>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.price}đ</div>
                          <div className="text-sm text-gray-500">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{order.customerInfo.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Địa chỉ giao hàng</h4>
                      <div className="flex items-start space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{order.customerInfo.address}</span>
                      </div>
                      {order.customerInfo.notes && (
                        <div className="mt-3">
                          <h5 className="font-medium text-gray-700 mb-1">Ghi chú:</h5>
                          <p className="text-sm text-gray-600">{order.customerInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    {order.status === "pending" && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                    <Button variant="outline">Liên hệ hỗ trợ</Button>
                    {order.status === "delivered" && (
                      <Button className="bg-green-600 hover:bg-green-700">Mua lại</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
