"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ProductFilterProps {
  onFilterChange: (type: string, category: string) => void
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [activeType, setActiveType] = useState("Tất Cả")
  const [activeCategory, setActiveCategory] = useState("Tất Cả")

  const wineTypes = ["Tất Cả", "Rượu Cần", "Rượu Dâu", "Rượu Nếp Cẩm", "Rượu Cốm"]
  const categories = ["Tất Cả", "Bình Dân", "Quà Tặng"]

  const handleTypeFilter = (type: string) => {
    setActiveType(type)
    onFilterChange(type, activeCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category)
    onFilterChange(activeType, category)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Loại Rượu</h3>
        <div className="flex flex-wrap gap-2">
          {wineTypes.map((type) => (
            <Button
              key={type}
              variant={activeType === type ? "default" : "outline"}
              className={`${activeType === type ? "bg-amber-600 hover:bg-amber-700" : "bg-white hover:bg-amber-50"}`}
              onClick={() => handleTypeFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phân Loại</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`${
                activeCategory === category
                  ? category === "Bình Dân"
                    ? "bg-green-600 hover:bg-green-700"
                    : category === "Quà Tặng"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  : category === "Bình Dân"
                    ? "bg-white hover:bg-green-50 border-green-300"
                    : category === "Quà Tặng"
                      ? "bg-white hover:bg-purple-50 border-purple-300"
                      : "bg-white hover:bg-amber-50"
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category === "Bình Dân"
                ? "Bình Dân (Chai Nhựa)"
                : category === "Quà Tặng"
                  ? "Quà Tặng (Chai Thủy Tinh)"
                  : category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
