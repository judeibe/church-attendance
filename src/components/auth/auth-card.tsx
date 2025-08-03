'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

type AuthMode = 'login' | 'register'

export function AuthCard() {
  const [mode, setMode] = React.useState<AuthMode>('login')
  const [successMessage, setSuccessMessage] = React.useState("")

  const handleAuthSuccess = () => {
    if (mode === 'login') {
      setSuccessMessage("Login successful! Redirecting to dashboard...")
      // In a real app, this would redirect to the dashboard
      setTimeout(() => {
        console.log("Redirecting to attendance dashboard...")
      }, 1000)
    } else {
      setSuccessMessage("Account created successfully! You are now logged in.")
      // In a real app, this would log the user in and redirect
      setTimeout(() => {
        console.log("Redirecting to attendance dashboard...")
      }, 1000)
    }
  }

  const handleAuthError = (error: string) => {
    console.error("Authentication error:", error)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          {mode === 'login' 
            ? 'Sign in to access your church attendance dashboard'
            : 'Create your account to get started'
          }
        </p>
      </CardHeader>
      <CardContent>
        {successMessage ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 bg-green-50 p-4 rounded-md">
              {successMessage}
            </div>
          </div>
        ) : (
          <>
            {mode === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} onError={handleAuthError} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} onError={handleAuthError} />
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don&apos;t have an account?" : "Already have an account?"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="mt-2"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}