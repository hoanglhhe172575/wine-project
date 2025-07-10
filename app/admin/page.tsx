"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  Users,
  ShoppingBag,
  BarChart3,
  LogOut,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Plus,
  Package,
  Edit,
} from "lucide-react"
import { useAuth, getAllUsers } from "../contexts/auth-context"
import { useProducts, type Product } from "../contexts/products-context"

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
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    category: "",
    packaging: "",
    volume: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "",
    image: "",
    description: "",
    alcohol: "",
    ingredient: "",
    aging: "",
    serving: "",
    pairing: "",
    story: "",
  })
  const [editProduct, setEditProduct] = useState({
    name: "",
    type: "",
    category: "",
    packaging: "",
    volume: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "",
    image: "",
    description: "",
    alcohol: "",
    ingredient: "",
    aging: "",
    serving: "",
    pairing: "",
    story: "",
  })

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
      ;(async () => {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      })()

      // Load orders from API instead of localStorage
      ;(async () => {
        try {
          const response = await fetch("/api/orders")
          if (response.ok) {
            const data = await response.json()
            setOrders(data.orders || [])
          } else {
            console.error("Failed to fetch orders from API")
            // Fallback to localStorage
            const savedOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
            setOrders(
              savedOrders.sort(
                (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              ),
            )
          }
        } catch (error) {
          console.error("Error fetching orders:", error)
          // Fallback to localStorage
          const savedOrders = JSON.parse(localStorage.getItem("wine-orders") || "[]")
          setOrders(
            savedOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          )
        }
      })()
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
    return orders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + order.total, 0)
  }

  const getTotalUsers = () => {
    return Array.isArray(users) ? users.filter((user) => user.role !== "admin").length : 0
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Reload orders from API
        const ordersResponse = await fetch("/api/orders")
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          setOrders(data.orders || [])

          // Update userOrders if viewing specific user orders
          if (selectedUser) {
            const filteredOrders = (data.orders || []).filter((order: Order) => order.userId === selectedUser.id)
            setUserOrders(filteredOrders)
          }
        }
      } else {
        alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!")
    }
  }

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.type || !newProduct.category || !newProduct.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const productData = {
      name: newProduct.name,
      type: newProduct.type,
      category: newProduct.category,
      packaging: newProduct.packaging || "Chai Nhựa",
      volume: newProduct.volume || "500ml",
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || undefined,
      discount: newProduct.discount ? Number.parseInt(newProduct.discount) : undefined,
      rating: newProduct.rating ? Number.parseFloat(newProduct.rating) : 4.0,
      image: newProduct.image || "/placeholder.svg?height=400&width=400",
      description: newProduct.description,
      details: {
        alcohol: newProduct.alcohol || "25%",
        ingredient: newProduct.ingredient || "Nguyên liệu tự nhiên",
        aging: newProduct.aging || "Ủ 2 tháng",
        serving: newProduct.serving || "Uống ở nhiệt độ phòng",
        pairing: newProduct.pairing || "Phù hợp với nhiều món ăn",
        volume: newProduct.volume || "500ml",
      },
      story: newProduct.story || "Sản phẩm được chế biến theo công thức truyền thống.",
    }

    addProduct(productData)

    // Reset form
    setNewProduct({
      name: "",
      type: "",
      category: "",
      packaging: "",
      volume: "",
      price: "",
      originalPrice: "",
      discount: "",
      rating: "",
      image: "",
      description: "",
      alcohol: "",
      ingredient: "",
      aging: "",
      serving: "",
      pairing: "",
      story: "",
    })

    setIsCreateProductOpen(false)
    alert("Thêm sản phẩm thành công!")
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setEditProduct({
      name: product.name,
      type: product.type,
      category: product.category,
      packaging: product.packaging,
      volume: product.volume,
      price: product.price,
      originalPrice: product.originalPrice || "",
      discount: product.discount?.toString() || "",
      rating: product.rating.toString(),
      image: product.image,
      description: product.description,
      alcohol: product.details.alcohol,
      ingredient: product.details.ingredient,
      aging: product.details.aging,
      serving: product.details.serving,
      pairing: product.details.pairing,
      story: product.story,
    })
    setIsEditProductOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct || !editProduct.name || !editProduct.type || !editProduct.category || !editProduct.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const productData = {
      name: editProduct.name,
      type: editProduct.type,
      category: editProduct.category,
      packaging: editProduct.packaging || "Chai Nhựa",
      volume: editProduct.volume || "500ml",
      price: editProduct.price,
      originalPrice: editProduct.originalPrice || undefined,
      discount: editProduct.discount ? Number.parseInt(editProduct.discount) : undefined,
      rating: editProduct.rating ? Number.parseFloat(editProduct.rating) : 4.0,
      image: editProduct.image || "/placeholder.svg?height=400&width=400",
      description: editProduct.description,
      details: {
        alcohol: editProduct.alcohol || "25%",
        ingredient: editProduct.ingredient || "Nguyên liệu tự nhiên",
        aging: editProduct.aging || "Ủ 2 tháng",
        serving: editProduct.serving || "Uống ở nhiệt độ phòng",
        pairing: editProduct.pairing || "Phù hợp với nhiều món ăn",
        volume: editProduct.volume || "500ml",
      },
      story: editProduct.story || "Sản phẩm được chế biến theo công thức truyền thống.",
    }

    updateProduct(editingProduct.id, productData)

    // Reset form
    setEditProduct({
      name: "",
      type: "",
      category: "",
      packaging: "",
      volume: "",
      price: "",
      originalPrice: "",
      discount: "",
      rating: "",
      image: "",
      description: "",
      alcohol: "",
      ingredient: "",
      aging: "",
      serving: "",
      pairing: "",
      story: "",
    })

    setEditingProduct(null)
    setIsEditProductOpen(false)
    alert("Cập nhật sản phẩm thành công!")
  }

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct(productId)
      alert("Xóa sản phẩm thành công!")
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
                  <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
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
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Quản lý sản phẩm</TabsTrigger>
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="orders">Quản lý đơn hàng</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Danh sách sản phẩm</CardTitle>
                  <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sản phẩm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Tên sản phẩm *</label>
                            <Input
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              placeholder="Nhập tên sản phẩm"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Loại rượu *</label>
                            <Select
                              value={newProduct.type}
                              onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại rượu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Rượu Dâu">Rượu Dâu</SelectItem>
                                <SelectItem value="Rượu Nếp Cẩm">Rượu Nếp Cẩm</SelectItem>
                                <SelectItem value="Rượu Cốm">Rượu Cốm</SelectItem>
                                <SelectItem value="Rượu Mơ">Rượu Mơ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Phân loại *</label>
                            <Select
                              value={newProduct.category}
                              onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn phân loại" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bình Dân">Bình Dân</SelectItem>
                                <SelectItem value="Quà Tặng">Quà Tặng</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Bao bì</label>
                            <Select
                              value={newProduct.packaging}
                              onValueChange={(value) => setNewProduct({ ...newProduct, packaging: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn bao bì" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chai Nhựa">Chai Nhựa</SelectItem>
                                <SelectItem value="Chai Thủy Tinh">Chai Thủy Tinh</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Dung tích</label>
                            <Select
                              value={newProduct.volume}
                              onValueChange={(value) => setNewProduct({ ...newProduct, volume: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn dung tích" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="500ml">500ml</SelectItem>
                                <SelectItem value="750ml">750ml</SelectItem>
                                <SelectItem value="1L">1L</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Giá bán *</label>
                            <Input
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              placeholder="50,000"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Giá gốc</label>
                            <Input
                              value={newProduct.originalPrice}
                              onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                              placeholder="55,000"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Giảm giá (%)</label>
                            <Input
                              type="number"
                              value={newProduct.discount}
                              onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Đánh giá</label>
                            <Input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={newProduct.rating}
                              onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                              placeholder="4.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">URL hình ảnh</label>
                          <Input
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="/images/product.jpg"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Mô tả sản phẩm</label>
                          <Textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Mô tả chi tiết về sản phẩm..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Độ cồn</label>
                            <Input
                              value={newProduct.alcohol}
                              onChange={(e) => setNewProduct({ ...newProduct, alcohol: e.target.value })}
                              placeholder="25%"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Thời gian ủ</label>
                            <Input
                              value={newProduct.aging}
                              onChange={(e) => setNewProduct({ ...newProduct, aging: e.target.value })}
                              placeholder="Ủ 2 tháng"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Thành phần</label>
                          <Input
                            value={newProduct.ingredient}
                            onChange={(e) => setNewProduct({ ...newProduct, ingredient: e.target.value })}
                            placeholder="Nguyên liệu chính, men rượu..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Cách thưởng thức</label>
                          <Input
                            value={newProduct.serving}
                            onChange={(e) => setNewProduct({ ...newProduct, serving: e.target.value })}
                            placeholder="Uống ở nhiệt độ phòng"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Kết hợp với</label>
                          <Input
                            value={newProduct.pairing}
                            onChange={(e) => setNewProduct({ ...newProduct, pairing: e.target.value })}
                            placeholder="Các món ăn phù hợp..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Câu chuyện sản phẩm</label>
                          <Textarea
                            value={newProduct.story}
                            onChange={(e) => setNewProduct({ ...newProduct, story: e.target.value })}
                            placeholder="Câu chuyện về nguồn gốc và quy trình sản xuất..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
                          Thêm sản phẩm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Sản phẩm</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Loại</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Phân loại</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Giá</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Đánh giá</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="rounded object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.volume}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-100 text-blue-800">{product.type}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                product.category === "Quà Tặng"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{product.price}đ</p>
                              {product.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">{product.originalPrice}đ</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Sửa sản phẩm: {editingProduct?.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tên sản phẩm *</label>
                      <Input
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Loại rượu *</label>
                      <Select
                        value={editProduct.type}
                        onValueChange={(value) => setEditProduct({ ...editProduct, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại rượu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rượu Dâu">Rượu Dâu</SelectItem>
                          <SelectItem value="Rượu Nếp Cẩm">Rượu Nếp Cẩm</SelectItem>
                          <SelectItem value="Rượu Cốm">Rượu Cốm</SelectItem>
                          <SelectItem value="Rượu Mơ">Rượu Mơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Phân loại *</label>
                      <Select
                        value={editProduct.category}
                        onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phân loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bình Dân">Bình Dân</SelectItem>
                          <SelectItem value="Quà Tặng">Quà Tặng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bao bì</label>
                      <Select
                        value={editProduct.packaging}
                        onValueChange={(value) => setEditProduct({ ...editProduct, packaging: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn bao bì" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chai Nhựa">Chai Nhựa</SelectItem>
                          <SelectItem value="Chai Thủy Tinh">Chai Thủy Tinh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Dung tích</label>
                      <Select
                        value={editProduct.volume}
                        onValueChange={(value) => setEditProduct({ ...editProduct, volume: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dung tích" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500ml">500ml</SelectItem>
                          <SelectItem value="750ml">750ml</SelectItem>
                          <SelectItem value="1L">1L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Giá bán *</label>
                      <Input
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        placeholder="50,000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Giá gốc</label>
                      <Input
                        value={editProduct.originalPrice}
                        onChange={(e) => setEditProduct({ ...editProduct, originalPrice: e.target.value })}
                        placeholder="55,000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Giảm giá (%)</label>
                      <Input
                        type="number"
                        value={editProduct.discount}
                        onChange={(e) => setEditProduct({ ...editProduct, discount: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Đánh giá</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={editProduct.rating}
                        onChange={(e) => setEditProduct({ ...editProduct, rating: e.target.value })}
                        placeholder="4.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">URL hình ảnh</label>
                    <Input
                      value={editProduct.image}
                      onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                      placeholder="/images/product.jpg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Mô tả sản phẩm</label>
                    <Textarea
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Độ cồn</label>
                      <Input
                        value={editProduct.alcohol}
                        onChange={(e) => setEditProduct({ ...editProduct, alcohol: e.target.value })}
                        placeholder="25%"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Thời gian ủ</label>
                      <Input
                        value={editProduct.aging}
                        onChange={(e) => setEditProduct({ ...editProduct, aging: e.target.value })}
                        placeholder="Ủ 2 tháng"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Thành phần</label>
                    <Input
                      value={editProduct.ingredient}
                      onChange={(e) => setEditProduct({ ...editProduct, ingredient: e.target.value })}
                      placeholder="Nguyên liệu chính, men rượu..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cách thưởng thức</label>
                    <Input
                      value={editProduct.serving}
                      onChange={(e) => setEditProduct({ ...editProduct, serving: e.target.value })}
                      placeholder="Uống ở nhiệt độ phòng"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Kết hợp với</label>
                    <Input
                      value={editProduct.pairing}
                      onChange={(e) => setEditProduct({ ...editProduct, pairing: e.target.value })}
                      placeholder="Các món ăn phù hợp..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Câu chuyện sản phẩm</label>
                    <Textarea
                      value={editProduct.story}
                      onChange={(e) => setEditProduct({ ...editProduct, story: e.target.value })}
                      placeholder="Câu chuyện về nguồn gốc và quy trình sản xuất..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleUpdateProduct} className="bg-blue-600 hover:bg-blue-700">
                    Cập nhật sản phẩm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

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
