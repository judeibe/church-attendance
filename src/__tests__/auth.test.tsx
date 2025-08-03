import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { AuthCard } from '@/components/auth/auth-card'

describe('Landing Page Authentication', () => {
  describe('LoginForm', () => {
    test('displays login form with required fields', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    test('shows validation errors for empty fields', async () => {
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    test('shows validation error for invalid email format', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    test('shows validation error for short password', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('RegisterForm', () => {
    test('displays registration form with all required fields', () => {
      render(<RegisterForm />)
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    test('shows validation errors for empty fields', async () => {
      render(<RegisterForm />)
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
        expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
      })
    })

    test('shows validation error when passwords do not match', async () => {
      render(<RegisterForm />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })
  })

  describe('AuthCard', () => {
    test('displays login form by default', () => {
      render(<AuthCard />)
      
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByText(/sign in to access your church attendance dashboard/i)).toBeInTheDocument()
    })

    test('switches to registration form when Create Account is clicked', async () => {
      render(<AuthCard />)
      
      const createAccountButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(createAccountButton)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
        expect(screen.getByText(/create your account to get started/i)).toBeInTheDocument()
      })
    })

    test('switches back to login form when Sign In is clicked', async () => {
      render(<AuthCard />)
      
      // Switch to registration first
      const createAccountButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(createAccountButton)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
      })
      
      // Switch back to login
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(signInButton)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
      })
    })
  })
})