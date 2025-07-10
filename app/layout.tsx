import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./contexts/cart-context"
import { AuthProvider } from "./contexts/auth-context"
import { ProductsProvider } from "./contexts/products-context"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nét Say",
  description: "Dự án bán rượu truyền thống cao cấp",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>{children}</CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
