"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER"; payload: User | null }

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<{ success: boolean; isAdmin: boolean }>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.role === "admin",
        isLoading: false,
      }
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      }
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isAdmin: action.payload?.role === "admin",
        isLoading: false,
      }
    default:
      return state
  }
}

// Enhanced mock users database with admin account
const mockUsers = [
  {
    id: "1",
    name: "Admin NETSAY",
    email: "kisutaybac@gmail.com",
    password: "123456",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    phone: "0979 810 712",
    address: "Hoa Lac, Thach That, Hanoi, Vietnam",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Nguyễn Văn A",
    email: "user@ruouvan.com",
    password: "123456",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    phone: "0987 654 321",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Trần Thị B",
    email: "customer@ruouvan.com",
    password: "123456",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    phone: "0912345678",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    createdAt: "2024-02-01",
  },
]

// Add function to save users to localStorage
const saveUsersToStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wine-users", JSON.stringify(mockUsers))
  }
}

// Add function to load users from localStorage
const loadUsersFromStorage = () => {
  const savedUsers = localStorage.getItem("wine-users")
  if (savedUsers) {
    try {
      const users = JSON.parse(savedUsers)
      // Merge saved users with default users, ensuring admin is always present
      const adminUser = mockUsers.find((u) => u.role === "admin")
      const mergedUsers = users.filter((u: any) => u.role !== "admin")
      if (adminUser) {
        mergedUsers.unshift(adminUser)
      }
      mockUsers.splice(0, mockUsers.length, ...mergedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      // Keep default users if loading fails
    }
  }
}

// Initialize users from storage and ensure admin exists
if (typeof window !== "undefined") {
  loadUsersFromStorage()
  // Ensure admin user always exists
  const adminExists = mockUsers.find((u) => u.email === "admin@ruouvan.com")
  if (!adminExists) {
    mockUsers.unshift({
      id: "1",
      name: "Admin NETSAY",
      email: "kisutaybac@gmail.com",
      password: "123456",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "admin",
      phone: "0979 810 712",
      address: "Hoa Lac, Thach That, Hanoi, Vietnam",
      createdAt: "2024-01-01",
    })
    saveUsersToStorage()
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("wine-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOAD_USER", payload: user })
      } catch (error) {
        console.error("Error loading user:", error)
        localStorage.removeItem("wine-user")
        dispatch({ type: "LOAD_USER", payload: null })
      }
    } else {
      dispatch({ type: "LOAD_USER", payload: null })
    }
  }, [])

  // Update the register function to save new users properly
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Load latest users from storage
    loadUsersFromStorage()

    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: "/placeholder.svg?height=40&width=40",
      role: "user",
      phone: "",
      address: "",
      createdAt: new Date().toISOString().split("T")[0],
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Save to localStorage
    saveUsersToStorage()

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
    }

    // Save current user to localStorage
    localStorage.setItem("wine-user", JSON.stringify(userData))
    dispatch({ type: "LOGIN_SUCCESS", payload: userData })
    return true
  }

  // Update login function to return admin status
  const login = async (email: string, password: string): Promise<{ success: boolean; isAdmin: boolean }> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Load latest users from storage
    loadUsersFromStorage()

    // Check credentials against mock database
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }

      // Save to localStorage
      localStorage.setItem("wine-user", JSON.stringify(userData))
      dispatch({ type: "LOGIN_SUCCESS", payload: userData })
      return { success: true, isAdmin: user.role === "admin" }
    } else {
      dispatch({ type: "LOGIN_FAILURE" })
      return { success: false, isAdmin: false }
    }
  }

  const logout = () => {
    localStorage.removeItem("wine-user")
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export function to get all users (admin only)
export function getAllUsers() {
  loadUsersFromStorage()
  return mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
    avatar: user.avatar,
  }))
}
