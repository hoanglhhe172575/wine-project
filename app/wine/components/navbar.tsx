"use client"

import { useState } from "react"
import Link from "next/link"
import { Wine, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Wine className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Rượu Truyền Thống</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
              Trang Chủ
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-amber-600 transition-colors">
              Sản Phẩm
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-amber-600 transition-colors">
              Giới Thiệu
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-amber-600 transition-colors">
              Liên Hệ
            </Link>
            <Button className="bg-amber-600 hover:bg-amber-700">Đặt Hàng</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản Phẩm
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới Thiệu
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </Link>
              <Button className="bg-amber-600 hover:bg-amber-700 w-fit">Đặt Hàng</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
