import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    console.log("=== REGISTRATION API CALLED ===")

    const { name, email, password } = await req.json()
    console.log("Registration data:", { name, email, passwordLength: password?.length })

    // Validation
    if (!name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ success: false, message: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" }, { status: 400 })
    }

    // Kiểm tra email đã tồn tại
    console.log("Checking if email exists...")
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json(
        { success: false, message: "Lỗi kiểm tra email: " + checkError.message },
        { status: 500 },
      )
    }

    if (existingUser) {
      console.log("User already exists with email:", email)
      return NextResponse.json({ success: false, message: "Email đã được sử dụng" }, { status: 409 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Password hashed successfully")

    // Tạo user mới
    console.log("Creating new user...")
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: "user",
          created_at: new Date().toISOString(),
        },
      ])
      .select("id, name, email, avatar, role")
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return NextResponse.json(
        { success: false, message: "Không thể tạo tài khoản: " + insertError.message },
        { status: 500 },
      )
    }

    if (!newUser) {
      console.error("No user returned after insert")
      return NextResponse.json(
        { success: false, message: "Không thể tạo tài khoản - không có dữ liệu trả về" },
        { status: 500 },
      )
    }

    console.log("User created successfully:", newUser)

    // Verify user was actually created
    const { data: verifyUser, error: verifyError } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("email", email)
      .single()

    if (verifyError || !verifyUser) {
      console.error("User verification failed:", verifyError)
      return NextResponse.json(
        { success: false, message: "Tài khoản được tạo nhưng không thể xác minh" },
        { status: 500 },
      )
    }

    console.log("User verified in database:", verifyUser)

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công!",
      user: {
        id: verifyUser.id.toString(),
        name: verifyUser.name,
        email: verifyUser.email,
        avatar: null,
        role: verifyUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
