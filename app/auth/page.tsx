"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Database } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function AuthPage() {
  const { state: authState, login, register } = useAuth()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      if (authState.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [authState.isAuthenticated, authState.isAdmin, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        // Redirect will be handled by useEffect
      } else {
        alert(result.message || "Email hoặc mật khẩu không đúng!")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Có lỗi xảy ra khi đăng nhập!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!")
      return
    }

    if (registerData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!")
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        address: registerData.address,
      })

      if (result.success) {
        alert(result.message || "Đăng ký thành công! Vui lòng đăng nhập.")
        // Reset form
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        })
      } else {
        alert(result.message || "Email đã tồn tại hoặc có lỗi xảy ra!")
      }
    } catch (error) {
      console.error("Register error:", error)
      alert("Có lỗi xảy ra khi đăng ký!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      <div className="flex items-center justify-center min-h-[80vh] py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Chào mừng đến với NETSAY</CardTitle>
              <p className="text-gray-600">Đăng nhập hoặc tạo tài khoản mới</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={loginData.email}
                          onChange={handleLoginInputChange}
                          placeholder="Nhập email của bạn"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={handleLoginInputChange}
                          placeholder="Nhập mật khẩu"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>                    
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-name"
                          name="name"
                          type="text"
                          value={registerData.name}
                          onChange={handleRegisterInputChange}
                          placeholder="Nhập họ và tên"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          value={registerData.email}
                          onChange={handleRegisterInputChange}
                          placeholder="Nhập email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={handleRegisterInputChange}
                            placeholder="Mật khẩu"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                          Xác nhận
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={registerData.confirmPassword}
                            onChange={handleRegisterInputChange}
                            placeholder="Xác nhận"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-phone" className="text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-phone"
                          name="phone"
                          type="tel"
                          value={registerData.phone}
                          onChange={handleRegisterInputChange}
                          placeholder="Nhập số điện thoại"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-address" className="text-sm font-medium text-gray-700">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-address"
                          name="address"
                          type="text"
                          value={registerData.address}
                          onChange={handleRegisterInputChange}
                          placeholder="Nhập địa chỉ"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Bằng cách đăng nhập, bạn đồng ý với{" "}
                  <Link href="/terms" className="text-green-600 hover:underline">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-green-600 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
