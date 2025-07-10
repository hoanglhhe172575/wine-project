"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: number
  name: string
  type: string
  category: string
  packaging: string
  volume: string
  price: string
  originalPrice?: string
  discount?: number
  rating: number
  image: string
  description: string
  details: {
    alcohol: string
    ingredient: string
    aging: string
    serving: string
    pairing: string
    volume: string
  }
  story: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
}

const ProductsContext = createContext<ProductsContextType | null>(null)

// Default products data
const defaultProducts: Product[] = [
  {
    id: 3,
    name: "Set Rượu Dâu Gia Đình",
    type: "Rượu Dâu",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    volume: "1L",
    price: "55,000",
    rating: 4.4,
    image: "/images/strawberry-wine-family.jpg",
    description: "Set rượu dâu tươi mát với hương vị ngọt ngào tự nhiên",
    details: {
      alcohol: "25%",
      ingredient: "Dâu tây tươi, đường cane, men rượu",
      aging: "Ủ 2 tháng",
      serving: "Uống lạnh hoặc pha với đá",
      pairing: "Bánh ngọt, trái cây, kem",
      volume: "1L",
    },
    story:
      "Rượu dâu được làm từ dâu tây tươi ngon nhất, qua quá trình lên men tự nhiên tạo nên hương vị ngọt ngào đặc trưng.",
  },
  {
    id: 4,
    name: "Set Rượu Dâu Premium",
    type: "Rượu Dâu",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    volume: "500ml",
    price: "142,500",
    originalPrice: "150,000",
    discount: 5,
    rating: 4.8,
    image: "/images/strawberry-wine-premium.jpg",
    description: "Set rượu dâu cao cấp được đóng chai thủy tinh đẹp mắt",
    details: {
      alcohol: "28%",
      ingredient: "Dâu tây organic, đường thốt nốt, men rượu cao cấp",
      aging: "Ủ 4 tháng",
      serving: "Uống lạnh trong ly rượu vang",
      pairing: "Chocolate, bánh kem, pho mát mềm",
      volume: "500ml",
    },
    story: "Phiên bản cao cấp của rượu dâu sử dụng dâu tây organic chất lượng cao và đường thốt nốt tự nhiên.",
  },
  {
    id: 5,
    name: "Set Rượu Nếp Cẩm Thường",
    type: "Rượu Nếp Cẩm",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    volume: "500ml",
    price: "50,000",
    rating: 4.2,
    image: "/images/purple-rice-wine-regular.jpg",
    description: "Set rượu nếp cẩm với màu tím đặc trưng, hương vị thơm ngon",
    details: {
      alcohol: "30%",
      ingredient: "Nếp cẩm, men rượu truyền thống",
      aging: "Ủ 3 tháng",
      serving: "Uống ở nhiệt độ phòng",
      pairing: "Thịt kho, cá nướng, chả lụa",
      volume: "500ml",
    },
    story: "Rượu nếp cẩm được làm từ nếp cẩm tự nhiên có màu tím đẹp mắt.",
  },
  {
    id: 6,
    name: "Set Rượu Nếp Cẩm Đặc Biệt",
    type: "Rượu Nếp Cẩm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    volume: "1L",
    price: "133,000",
    originalPrice: "140,000",
    discount: 5,
    rating: 4.6,
    image: "/images/purple-rice-wine-special.jpg",
    description: "Set rượu nếp cẩm với màu sắc đẹp mắt",
    details: {
      alcohol: "33%",
      ingredient: "Nếp cẩm hạt to, men rượu đặc biệt",
      aging: "Ủ 5 tháng",
      serving: "Uống ở nhiệt độ phòng trong ly nhỏ",
      pairing: "Thịt nướng, hải sản, bánh chưng",
      volume: "1L",
    },
    story: "Phiên bản cao cấp của rượu nếp cẩm sử dụng nếp cẩm hạt to chất lượng cao nhất.",
  },
  {
    id: 7,
    name: "Set Rượu Cốm Gia Đình",
    type: "Rượu Cốm",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    volume: "500ml",
    price: "48,000",
    rating: 4.1,
    image: "/images/rice-wine-family.jpg",
    description: "Set rượu cốm xanh với hương vị đặc trưng của cốm non tươi",
    details: {
      alcohol: "27%",
      ingredient: "Cốm xanh tươi, men rượu tự nhiên",
      aging: "Ủ 2 tháng",
      serving: "Uống ở nhiệt độ phòng",
      pairing: "Bánh đậu xanh, chè, trái cây",
      volume: "500ml",
    },
    story: "Rượu cốm được chế biến từ cốm xanh tươi non, mang hương vị đặc trưng của mùa thu Hà Nội.",
  },
  {
    id: 8,
    name: "Set Rượu Cốm Hảo Hạng",
    type: "Rượu Cốm",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    volume: "500ml",
    price: "128,250",
    originalPrice: "135,000",
    discount: 5,
    rating: 4.5,
    image: "/images/rice-wine-premium.jpg",
    description: "Set rượu cốm cao cấp được chế biến từ cốm xanh tươi",
    details: {
      alcohol: "30%",
      ingredient: "Cốm xanh cao cấp, men rượu đặc biệt",
      aging: "Ủ 4 tháng",
      serving: "Uống ở nhiệt độ phòng trong ly nhỏ",
      pairing: "Bánh trung thu, trà xanh, bánh quy",
      volume: "500ml",
    },
    story: "Phiên bản cao cấp của rượu cốm sử dụng cốm xanh tươi nhất trong mùa.",
  },
  {
    id: 9,
    name: "Set Rượu Mơ Truyền Thống",
    type: "Rượu Mơ",
    category: "Bình Dân",
    packaging: "Chai Nhựa",
    volume: "1L",
    price: "75,000",
    rating: 4.2,
    image: "/images/plum-wine-traditional.jpg",
    description: "Set rượu mơ truyền thống với hương vị thơm ngon đặc trưng",
    details: {
      alcohol: "26%",
      ingredient: "Mơ chín tự nhiên, đường cane, men rượu",
      aging: "Ủ 3 tháng",
      serving: "Uống lạnh hoặc ở nhiệt độ phòng",
      pairing: "Bánh tráng nướng, hạt điều, trái cây khô",
      volume: "1L",
    },
    story: "Rượu mơ được chế biến từ những trái mơ chín tự nhiên, có hương thơm đặc trưng và vị ngọt dịu.",
  },
  {
    id: 10,
    name: "Set Rượu Mơ Đặc Biệt",
    type: "Rượu Mơ",
    category: "Quà Tặng",
    packaging: "Chai Thủy Tinh",
    volume: "500ml",
    price: "165,000",
    rating: 4.9,
    image: "/images/plum-wine-special.jpg",
    description: "Set rượu mơ cao cấp với hương vị thơm ngon đặc trưng",
    details: {
      alcohol: "30%",
      ingredient: "Mơ organic cao cấp, đường thốt nốt, men rượu đặc biệt",
      aging: "Ủ 6 tháng",
      serving: "Uống lạnh trong ly rượu vang",
      pairing: "Chocolate đen, bánh tart, pho mát cứng",
      volume: "500ml",
    },
    story: "Phiên bản cao cấp nhất của rượu mơ sử dụng mơ organic chất lượng cao và quy trình ủ lâu.",
  },
]

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("wine-products")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts(defaultProducts)
        localStorage.setItem("wine-products", JSON.stringify(defaultProducts))
      }
    } else {
      setProducts(defaultProducts)
      localStorage.setItem("wine-products", JSON.stringify(defaultProducts))
    }
  }, [])

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("wine-products", JSON.stringify(products))
    }
  }, [products])

  const addProduct = (productData: Omit<Product, "id">) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1
    const newProduct: Product = {
      ...productData,
      id: newId,
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: number, productData: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...productData } : product)))
  }

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const getProductById = (id: number) => {
    return products.find((product) => product.id === id)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
