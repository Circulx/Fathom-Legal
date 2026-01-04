import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from './mongodb'
import Admin from '@/models/Admin'
import { isFirstUser, createFirstAdmin } from './adminUtils'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔐 Attempting authentication for:', credentials.email)
          await connectDB()
          console.log('✅ Database connected')
          
          // Check if this is the first user
          const isFirst = await isFirstUser()
          console.log('📊 Is first user:', isFirst)
          
          if (isFirst) {
            // First user becomes super-admin
            const name = credentials.name || 'Super Admin'
            console.log('👤 Creating first admin:', name)
            const firstAdmin = await createFirstAdmin(
              credentials.email, 
              credentials.password, 
              name
            )
            
            console.log('✅ First admin created:', firstAdmin.email)
            return {
              id: firstAdmin._id.toString(),
              email: firstAdmin.email,
              name: firstAdmin.name,
              role: firstAdmin.role
            }
          }
          
          // Regular authentication for existing admins
          console.log('🔍 Looking up existing admin with email:', credentials.email.toLowerCase())
          const admin = await Admin.findOne({ 
            email: credentials.email.toLowerCase()
          })

          if (!admin) {
            console.log('❌ Admin not found with email:', credentials.email.toLowerCase())
            // Check if any admins exist
            const adminCount = await Admin.countDocuments()
            console.log('📊 Total admins in database:', adminCount)
            return null
          }

          console.log('👤 Admin found:', admin.name, 'isActive:', admin.isActive)
          
          if (!admin.isActive) {
            console.log('❌ Admin account is inactive')
            return null
          }

          console.log('🔐 Comparing password...')
          const isPasswordValid = await admin.comparePassword(credentials.password)
          console.log('🔐 Password valid:', isPasswordValid)
          
          if (isPasswordValid) {
            // Update last login
            await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })
            console.log('✅ Last login updated')
            
            return {
              id: admin._id.toString(),
              email: admin.email,
              name: admin.name,
              role: admin.role
            }
          }
          
          console.log('❌ Invalid password for admin:', admin.email)
          return null
        } catch (error) {
          console.error('❌ Auth error:', error)
          if (error instanceof Error) {
            console.error('❌ Error message:', error.message)
            console.error('❌ Error stack:', error.stack)
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  }
}