
import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}