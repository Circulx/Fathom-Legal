import connectDB from './mongodb'
import Admin from '@/models/Admin'

export async function createFirstAdmin(email: string, password: string, name: string) {
  try {
    await connectDB()
    
    // Check if any admin exists
    const existingAdmin = await Admin.findOne()
    
    if (existingAdmin) {
      throw new Error('Admin system already initialized')
    }

    // Create first admin as super-admin
    const superAdmin = new Admin({
      email: email.toLowerCase(),
      password,
      name,
      role: 'super-admin',
      isActive: true,
      permissions: ['manage_admins', 'manage_content', 'view_analytics', 'manage_users']
    })

    await superAdmin.save()
    return superAdmin
  } catch (error) {
    console.error('Error creating first admin:', error)
    throw error
  }
}

export async function createAdminBySuperAdmin(
  email: string, 
  password: string, 
  name: string, 
  permissions: string[], 
  createdBy: string
) {
  try {
    await connectDB()
    
    // Verify the creator is a super-admin
    const creator = await Admin.findById(createdBy)
    if (!creator || creator.role !== 'super-admin') {
      throw new Error('Only super-admins can create new admins')
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      throw new Error('Admin with this email already exists')
    }

    const admin = new Admin({
      email: email.toLowerCase(),
      password,
      name,
      role: 'admin',
      isActive: true,
      createdBy,
      permissions
    })

    await admin.save()
    return admin
  } catch (error) {
    console.error('Error creating admin:', error)
    throw error
  }
}

export async function isFirstUser() {
  try {
    await connectDB()
    const adminCount = await Admin.countDocuments()
    return adminCount === 0
  } catch (error) {
    console.error('Error checking first user:', error)
    return false
  }
}

export async function getAllAdmins() {
  try {
    await connectDB()
    return await Admin.find({ isActive: true }).select('-password')
  } catch (error) {
    console.error('Error fetching admins:', error)
    throw error
  }
}

export async function updateAdminStatus(adminId: string, isActive: boolean, updatedBy: string) {
  try {
    await connectDB()
    
    // Verify the updater is a super-admin
    const updater = await Admin.findById(updatedBy)
    if (!updater || updater.role !== 'super-admin') {
      throw new Error('Only super-admins can update admin status')
    }

    // Prevent super-admin from deactivating themselves
    if (adminId === updatedBy) {
      throw new Error('Cannot deactivate your own account')
    }

    return await Admin.findByIdAndUpdate(adminId, { isActive }, { new: true })
  } catch (error) {
    console.error('Error updating admin status:', error)
    throw error
  }
}










