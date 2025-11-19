// Script to delete the admin user
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import the Admin model (we'll define it here since we can't import from src)
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: String,
  name: String,
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super-admin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdBy: String,
  permissions: [String]
}, {
  timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function deleteAdmin() {
  try {
    console.log('🔗 Connecting to database...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find the admin to delete
    const adminToDelete = await Admin.findOne({ email: 'admin@fathomlegal.com' });
    
    if (!adminToDelete) {
      console.log('❌ Admin not found with email: admin@fathomlegal.com');
      return;
    }

    console.log('🔍 Found admin:', {
      id: adminToDelete._id,
      email: adminToDelete.email,
      name: adminToDelete.name,
      role: adminToDelete.role
    });

    // Delete the admin
    await Admin.findByIdAndDelete(adminToDelete._id);
    console.log('✅ Admin deleted successfully');

    // Verify deletion
    const remainingAdmins = await Admin.countDocuments();
    console.log('📊 Remaining admins in database:', remainingAdmins);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the deletion
deleteAdmin();


























