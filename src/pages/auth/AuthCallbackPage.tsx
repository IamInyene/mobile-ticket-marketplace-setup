
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/auth/login')
          return
        }

        if (data.session) {
          navigate('/')
        } else {
          navigate('/auth/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/auth/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <p className="text-center text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}