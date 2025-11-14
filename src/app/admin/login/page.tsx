'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AlertCircle, User } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFirstUser, setIsFirstUser] = useState(false)
  const [isCheckingFirstUser, setIsCheckingFirstUser] = useState(true)
  const router = useRouter()

  // Check if this is the first user
  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const response = await fetch('/api/admin/check-first-user')
        if (response.ok) {
          const data = await response.json()
          setIsFirstUser(data.isFirstUser)
        }
      } catch (error) {
        console.error('Error checking first user:', error)
      } finally {
        setIsCheckingFirstUser(false)
      }
    }
    checkFirstUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isFirstUser) {
        // Create first admin user
        const response = await fetch('/api/admin/create-first-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name: name,
          }),
        })

        if (response.ok) {
          // After creating first admin, sign them in with NextAuth
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          })
          
          if (result?.ok) {
            router.push('/admin/dashboard')
          } else {
            setError('Account created but login failed. Please try logging in.')
          }
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to create admin')
        }
      } else {
        // Login existing admin using NextAuth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          console.log('Login successful, redirecting to dashboard')
          router.push('/admin/dashboard')
        } else {
          console.error('Login failed:', result?.error)
          // Map NextAuth error codes to user-friendly messages
          if (result?.error === 'CredentialsSignin') {
            setError('Invalid credentials')
          } else {
            setError(result?.error || 'Invalid credentials')
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking first user
  if (isCheckingFirstUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 shadow-lg">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isFirstUser ? 'Setup Admin Account' : 'Admin Login'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isFirstUser 
                ? 'You are the first user. You will become the super admin.' 
                : 'Fathom Legal Admin Panel'
              }
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isFirstUser && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required={isFirstUser}
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-200"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-200"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-200"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}