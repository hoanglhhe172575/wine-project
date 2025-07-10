"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Facebook, Mail, Loader2, Shield } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string>("")

  const { login, register, state } = useAuth()
  const router = useRouter()

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors("")
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors("")
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors("")

    if (!loginData.email || !loginData.password) {
      setErrors("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const result = await login(loginData.email, loginData.password)

    if (result.success) {
      if (result.isAdmin) {
        alert("Chào mừng Admin! Đang chuyển đến trang quản trị...")
        router.push("/admin")
      } else {
        alert("Đăng nhập thành công!")
        router.push("/")
      }
    } else {
      setErrors("Email hoặc mật khẩu không đúng!")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors("")

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setErrors("Vui lòng điền đầy đủ thông tin!")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrors("Mật khẩu xác nhận không khớp!")
      return
    }

    if (registerData.password.length < 6) {
      setErrors("Mật khẩu phải có ít nhất 6 ký tự!")
      return
    }

    const success = await register(registerData.name, registerData.email, registerData.password)

    if (success) {
      alert("Đăng ký thành công!")
      router.push("/")
    } else {
      setErrors("Email đã tồn tại!")
    }
  }

  // Redirect if already logged in
  if (state.isAuthenticated) {
    if (state.isAdmin) {
      router.push("/admin")
    } else {
      router.push("/")
    }
    return null
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

      {/* Auth Form */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-8">
          {/* Tabs */}
          <div className="flex mb-8">
            <button
              onClick={() => {
                setActiveTab("login")
                setErrors("")
              }}
              className={`flex-1 pb-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === "login"
                  ? "text-green-600 border-green-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setActiveTab("register")
                setErrors("")
              }}
              className={`flex-1 pb-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === "register"
                  ? "text-green-600 border-green-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error Message */}
          {errors && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors}</div>}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  EMAIL*
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full"
                  placeholder="Nhập Địa chỉ Email"
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  MẬT KHẨU*
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full"
                  placeholder="Nhập Mật khẩu"
                  disabled={state.isLoading}
                />
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </Button>
              
              <div className="text-center text-gray-500 text-sm">hoặc đăng nhập qua</div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white py-3" disabled>
                  <Facebook className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white py-3" disabled>
                  <Mail className="mr-2 h-5 w-5" />
                  Google
                </Button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  HỌ VÀ TÊN*
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                  placeholder="Nhập Họ và Tên"
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  EMAIL*
                </label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                  placeholder="Nhập Địa chỉ Email"
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  MẬT KHẨU*
                </label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                  placeholder="Nhập Mật khẩu (ít nhất 6 ký tự)"
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  XÁC NHẬN MẬT KHẨU*
                </label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="w-full"
                  placeholder="Nhập lại Mật khẩu"
                  disabled={state.isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  "ĐĂNG KÝ"
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 leading-relaxed">
                Bằng việc đăng ký, bạn đã đồng ý với
                <br />
                <Link href="/terms" className="text-green-600 hover:text-green-700">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-green-600 hover:text-green-700">
                  Chính sách bảo mật
                </Link>
              </div>

              <div className="text-center text-gray-500 text-sm">hoặc đăng ký qua</div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white py-3" disabled>
                  <Facebook className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white py-3" disabled>
                  <Mail className="mr-2 h-5 w-5" />
                  Google
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
