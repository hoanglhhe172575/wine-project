"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { useAuth, getAllUsers } from "../contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: string
  phone: string
  address: string
  createdAt: string
  avatar: string
}

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

export default function AdminPage() {
  const { state: authState, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userOrders, setUserOrders] = useState<Order[]>([])

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.isAdmin) {
      router.push("/auth")
    }
  }, [authState.isAuthenticated, authState.isAdmin, router])

  // Load data
  useEffect(() => {
    if (authState.isAdmin) {
      // Load users
      const allUsers = getAllUsers()
      setUsers(allUsers)

      // Load orders
      const savedOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
      setOrders(
        savedOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      )
    }
  }, [authState.isAdmin])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleViewUserOrders = (user: User) => {
    setSelectedUser(user)
    const orders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
    const filteredOrders = orders.filter((order: Order) => order.userId === user.id)
    setUserOrders(filteredOrders)
  }

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

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getTotalUsers = () => {
    return users.filter((user) => user.role !== "admin").length
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)

    // Update localStorage
    localStorage.setItem("wine-orders", JSON.stringify(updatedOrders))

    // Update userOrders if viewing specific user orders
    if (selectedUser) {
      const filteredOrders = updatedOrders.filter((order: Order) => order.userId === selectedUser.id)
      setUserOrders(filteredOrders)
    }
  }

  if (!authState.isAuthenticated || !authState.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-red-600">
                <Image src="/images/logo.png" alt="Admin Logo" fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trang Quản Trị NETSAY</h1>
                <p className="text-sm text-gray-500">Chào mừng, {authState.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Button onClick={() => router.push("/")} variant="outline" className="bg-transparent">
                Về trang chủ
              </Button> */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalUsers()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(getTotalRevenue())}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đơn chờ xử lý</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((order) => order.status === "pending").length}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="orders">Quản lý đơn hàng</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Người dùng</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Vai trò</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày tạo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={user.role === "admin" ? "bg-red-500" : "bg-blue-500"}>
                              {user.role === "admin" ? "Quản trị" : "Người dùng"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.createdAt}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUserOrders(user)}
                                className="bg-transparent"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Xem đơn hàng
                              </Button>
                              {user.role !== "admin" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* User Orders Modal */}
            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Đơn hàng của {selectedUser.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(null)}
                      className="bg-transparent"
                    >
                      Đóng
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Người dùng này chưa có đơn hàng nào</p>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">Đơn hàng #{order.id}</h4>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusBadge(order.status)}
                                {/* Status Update Buttons for User Orders */}
                                {order.status === "pending" && (
                                  <div className="flex space-x-1">
                                    <Button
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, "confirmed")}
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                                    >
                                      Xác nhận
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                                    >
                                      Hủy
                                    </Button>
                                  </div>
                                )}
                                {order.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "shipping")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1"
                                  >
                                    Giao hàng
                                  </Button>
                                )}
                                {order.status === "shipping" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "delivered")}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                                  >
                                    Đã giao
                                  </Button>
                                )}
                              </div>
                              <p className="font-bold text-green-600">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>
                              <strong>Số lượng sản phẩm:</strong> {order.items.length}
                            </p>
                            <p>
                              <strong>Địa chỉ:</strong> {order.customerInfo.address}
                            </p>
                            <p>
                              <strong>Điện thoại:</strong> {order.customerInfo.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Đơn hàng #{order.id}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ShoppingBag className="h-4 w-4" />
                              <span>{order.items.length} sản phẩm</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusBadge(order.status)}
                            {/* Status Update Buttons */}
                            {order.status === "pending" && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "confirmed")}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                                >
                                  Xác nhận
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                                >
                                  Hủy
                                </Button>
                              </div>
                            )}
                            {order.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "shipping")}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1"
                              >
                                Giao hàng
                              </Button>
                            )}
                            {order.status === "shipping" && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "delivered")}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                              >
                                Đã giao
                              </Button>
                            )}
                          </div>
                          <div className="text-lg font-bold text-green-600">{formatPrice(order.total)}</div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                          <div className="space-y-1 text-sm">
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
                          <h4 className="font-medium text-gray-900 mb-2">Địa chỉ giao hàng</h4>
                          <div className="flex items-start space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span>{order.customerInfo.address}</span>
                          </div>
                          {order.customerInfo.notes && (
                            <div className="mt-2">
                              <h5 className="font-medium text-gray-700 mb-1">Ghi chú:</h5>
                              <p className="text-sm text-gray-600">{order.customerInfo.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 text-sm">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-500">{item.type}</p>
                              </div>
                              <div className="text-right">
                                <p>x{item.quantity}</p>
                                <p className="font-medium">{item.price}đ</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Trạng thái đơn hàng</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <div
                            className={`flex items-center space-x-2 ${order.status === "pending" || order.status === "confirmed" || order.status === "shipping" || order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "pending" || order.status === "confirmed" || order.status === "shipping" || order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
                            ></div>
                            <span>Đang xử lý</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div
                            className={`flex items-center space-x-2 ${order.status === "confirmed" || order.status === "shipping" || order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "confirmed" || order.status === "shipping" || order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
                            ></div>
                            <span>Đã xác nhận</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div
                            className={`flex items-center space-x-2 ${order.status === "shipping" || order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "shipping" || order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
                            ></div>
                            <span>Đang giao hàng</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div
                            className={`flex items-center space-x-2 ${order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "delivered" ? "bg-green-600" : "bg-gray-300"}`}
                            ></div>
                            <span>Đã giao hàng</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
