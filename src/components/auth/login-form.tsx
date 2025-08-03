'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; general?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, check for a simple test account
      if (email === "admin@church.com" && password === "password") {
        onSuccess?.()
      } else {
        setErrors({ general: "Invalid email or password. Please try again." })
        onError?.("Invalid credentials")
      }
    } catch {
      setErrors({ general: "An error occurred. Please try again." })
      onError?.("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="login-email">Email Address</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          required
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          required
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {errors.general && (
        <div role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {errors.general}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
        aria-describedby="login-help"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <p id="login-help" className="text-xs text-gray-500 mt-2">
        Demo: Use admin@church.com / password to test login
      </p>
    </form>
  )
}