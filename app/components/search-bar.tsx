"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Always navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
      setSearchQuery("")
    }
  }

  const handleQuickSearch = (query: string) => {
    // Always navigate to products page with search query
    router.push(`/products?search=${encodeURIComponent(query)}`)
    onClose()
    setSearchQuery("")
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
      <div className="p-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Từ khóa tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>

        {/* Quick search suggestions */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Tìm kiếm phổ biến:</p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => handleQuickSearch("Rượu Cần")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            >
              Rượu Cần
            </button>
            <button
              onClick={() => handleQuickSearch("Rượu Dâu")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            >
              Rượu Dâu
            </button>
            <button
              onClick={() => handleQuickSearch("Cao Cấp")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            >
              Cao Cấp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
