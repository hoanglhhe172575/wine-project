"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

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
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  getProductById: (id: number) => Product | undefined
  loading: boolean
}

const ProductsContext = createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Load products from Supabase on mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading products:", error)
        return
      }

      const formattedProducts =
        data?.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          category: product.category,
          packaging: product.packaging,
          volume: product.volume,
          price: product.price,
          originalPrice: product.original_price,
          discount: product.discount,
          rating: product.rating,
          image: product.image,
          description: product.description,
          details: product.details,
          story: product.story,
        })) || []

      setProducts(formattedProducts)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: productData.name,
            type: productData.type,
            category: productData.category,
            packaging: productData.packaging,
            volume: productData.volume,
            price: productData.price,
            original_price: productData.originalPrice,
            discount: productData.discount,
            rating: productData.rating,
            image: productData.image,
            description: productData.description,
            details: productData.details,
            story: productData.story,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error adding product:", error)
        throw error
      }

      // Reload products to get the latest data
      await loadProducts()
    } catch (error) {
      console.error("Error adding product:", error)
      throw error
    }
  }

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const updateData: any = {}

      if (productData.name) updateData.name = productData.name
      if (productData.type) updateData.type = productData.type
      if (productData.category) updateData.category = productData.category
      if (productData.packaging) updateData.packaging = productData.packaging
      if (productData.volume) updateData.volume = productData.volume
      if (productData.price) updateData.price = productData.price
      if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice
      if (productData.discount !== undefined) updateData.discount = productData.discount
      if (productData.rating !== undefined) updateData.rating = productData.rating
      if (productData.image) updateData.image = productData.image
      if (productData.description) updateData.description = productData.description
      if (productData.details) updateData.details = productData.details
      if (productData.story) updateData.story = productData.story

      const { error } = await supabase.from("products").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating product:", error)
        throw error
      }

      // Reload products to get the latest data
      await loadProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        console.error("Error deleting product:", error)
        throw error
      }

      // Remove from local state
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
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
        loading,
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
