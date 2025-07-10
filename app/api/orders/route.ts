import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Lấy danh sách đơn hàng
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_price,
          product_image,
          product_type,
          quantity
        )
      `)
      .order("created_at", { ascending: false })

    // Nếu có userId, chỉ lấy đơn hàng của user đó
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    // Transform data để match với frontend interface
    const transformedOrders =
      orders?.map((order) => ({
        id: order.id,
        userId: order.user_id.toString(),
        items:
          order.order_items?.map((item: { product_id: any; product_name: any; product_price: any; product_image: any; quantity: any; product_type: any }) => ({
            id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            image: item.product_image,
            quantity: item.quantity,
            type: item.product_type,
          })) || [],
        customerInfo: order.customer_info,
        total: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
      })) || []

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error("Error in GET /api/orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, customerInfo, total, status = "pending" } = body

    if (!userId || !items || !customerInfo || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          id: orderId,
          user_id: Number.parseInt(userId),
          customer_info: customerInfo,
          total_amount: total,
          status: status,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      product_image: item.image,
      product_type: item.type,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to delete the order if items failed
      await supabase.from("orders").delete().eq("id", orderId)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
