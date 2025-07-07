"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, Search, ShoppingCart, LogOut, Settings, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "../contexts/cart-context"
import { useAuth } from "../contexts/auth-context"
import SearchBar from "./search-bar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state } = useCart()
  const { state: authState, logout } = useAuth()

  const handleLogout = () => {
    logout()
    alert("Đã đăng xuất thành công!")
  }

  return (
    <div className="relative">
      <nav className="bg-green-300 text-gray-800 fixed top-0 left-0 right-0 z-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-green-800 font-medium hover:text-green-900 transition-colors text-sm">
                Trang chủ
              </Link>
              <Link href="/about" className="hover:text-green-800 transition-colors text-sm">
                Giới thiệu
              </Link>
              <Link href="/products" className="hover:text-green-800 transition-colors text-sm">
                Sản phẩm
              </Link>
              <Link href="/news" className="hover:text-green-800 transition-colors text-sm">
                Tin tức
              </Link>
              <Link href="/contact" className="hover:text-green-800 transition-colors text-sm">
                Liên hệ
              </Link>
            </nav>

            {/* Center Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="text-center">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden border-3 border-green-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Image src="/images/logo.png" alt="NETSAV Northwest Logo" fill className="object-cover" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-700">HOTLINE:</div>
                <div className="font-bold text-green-800 text-sm">0979 810 712</div>
              </div>
              <div className="flex items-center space-x-1">
                {/* User Menu */}
                {authState.isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    {/* Order History Button - Desktop */}
                    <Link href="/orders" className="hidden md:block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-800 hover:text-green-800 flex items-center space-x-1 h-8 px-2"
                      >
                        <History className="h-4 w-4" />
                        <span className="text-xs">Lịch sử</span>
                      </Button>
                    </Link>

                    {/* User Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-800 hover:text-green-800 flex items-center space-x-1 h-8 px-2 bg-green-200 hover:bg-green-100 rounded-full"
                        >
                          {authState.user?.avatar ? (
                            <Image
                              src={authState.user.avatar || "/placeholder.svg"}
                              alt={authState.user.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <span className="hidden md:block text-xs font-medium">{authState.user?.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{authState.user?.name}</p>
                            <p className="text-xs text-gray-500">{authState.user?.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Cài đặt tài khoản</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/orders" className="flex items-center w-full">
                            <History className="mr-2 h-4 w-4" />
                            <span>Lịch sử mua hàng</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/cart" className="flex items-center w-full">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Giỏ hàng của tôi</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Quick Logout Button - Desktop */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="hidden md:flex text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      title="Đăng xuất"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-800 hover:text-green-800 h-8 px-2 bg-green-200 hover:bg-green-100 rounded-full"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden md:block ml-1 text-xs font-medium">Đăng nhập</span>
                    </Button>
                  </Link>
                )}

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-800 hover:text-green-800 h-8 w-8 p-0"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                </div>
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="text-gray-800 hover:text-green-800 relative h-8 w-8 p-0">
                    <ShoppingCart className="h-4 w-4" />
                    {state.itemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px]">
                        {state.itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-800 h-8 w-8 p-0"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t border-green-400">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-green-800 font-medium hover:text-green-900 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/about"
                  className="hover:text-green-800 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/products"
                  className="hover:text-green-800 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
                <Link
                  href="/news"
                  className="hover:text-green-800 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-green-800 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liên hệ
                </Link>

                {/* Mobile User Menu */}
                <div className="pt-2 border-t border-green-400">
                  {authState.isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 px-2 py-1 bg-green-200 rounded">
                        {authState.user?.avatar ? (
                          <Image
                            src={authState.user.avatar || "/placeholder.svg"}
                            alt={authState.user.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">{authState.user?.name}</span>
                      </div>

                      {/* Mobile Order History Button */}
                      <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-800 hover:text-green-800 w-full justify-start h-8"
                        >
                          <History className="h-4 w-4 mr-2" />
                          <span className="text-xs">Lịch sử mua hàng</span>
                        </Button>
                      </Link>

                      {/* Mobile Cart Button */}
                      <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-800 hover:text-green-800 w-full justify-start h-8"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          <span className="text-xs">Giỏ hàng của tôi</span>
                        </Button>
                      </Link>

                      {/* Mobile Logout Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start h-8"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="text-xs">Đăng xuất</span>
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-800 hover:text-green-800 w-full justify-start h-8 bg-green-200 hover:bg-green-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-xs font-medium">Đăng nhập</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Mobile Search */}
                <div className="pt-2 border-t border-green-400">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-800 hover:text-green-800 w-full justify-start h-8"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      <span className="text-xs">Tìm kiếm</span>
                    </Button>
                    {isSearchOpen && (
                      <div className="mt-2">
                        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C150,60 350,60 600,90 C850,120 1050,60 1200,90 L1200,0 L0,0 Z"
              className="fill-green-300"
            ></path>
          </svg>
        </div>
      </nav>
      {/* Add spacer div to push content below fixed header */}
      <div className="h-20"></div>
    </div>
  )
}
