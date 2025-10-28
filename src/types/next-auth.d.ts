import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'super-admin'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'super-admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'super-admin'
    id: string
  }
}