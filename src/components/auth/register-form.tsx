'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ 
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string 
  }>({})

  const validateForm = () => {
    const newErrors: { 
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      // Simulate API call - replace with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, simulate successful registration
      console.log("Registration data:", { name: name.trim(), email, password })
      onSuccess?.()
    } catch {
      setErrors({ general: "An error occurred during registration. Please try again." })
      onError?.("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="register-name">Full Name</Label>
        <Input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          required
        />
        {errors.name && (
          <p id="register-name-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="register-email">Email Address</Label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          required
        />
        {errors.email && (
          <p id="register-email-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          required
        />
        {errors.password && (
          <p id="register-password-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="register-confirm-password">Confirm Password</Label>
        <Input
          id="register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
          required
        />
        {errors.confirmPassword && (
          <p id="register-confirm-password-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.confirmPassword}
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
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}