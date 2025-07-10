import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Lấy chi tiết đơn hàng
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    const { data: order, error } = await supabase
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
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Transform data
    const transformedOrder = {
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
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error("Error in GET /api/orders/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Cập nhật trạng thái đơn hàng
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: order,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Error in PUT /api/orders/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Xóa đơn hàng (chỉ admin)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Delete order items first
    const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", orderId)

    if (itemsError) {
      console.error("Error deleting order items:", itemsError)
      return NextResponse.json({ error: "Failed to delete order items" }, { status: 500 })
    }

    // Delete order
    const { error: orderError } = await supabase.from("orders").delete().eq("id", orderId)

    if (orderError) {
      console.error("Error deleting order:", orderError)
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE /api/orders/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
