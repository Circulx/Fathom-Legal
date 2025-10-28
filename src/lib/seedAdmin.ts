import connectDB from './mongodb'
import Admin from '@/models/Admin'

export async function seedAdmin() {
  try {
    await connectDB()
    
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({})
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    console.log('No admin users found. Please create an admin through the first user registration process.')
  } catch (error) {
    console.error('Error seeding admin:', error)
  }
}