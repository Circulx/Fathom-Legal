// Simple database connection test
const mongoose = require('mongoose');

// Test connection function
async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('Please create a .env.local file with your connection string');
      return;
    }

    // Mask the URI for security
    const maskedUri = process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('🔗 Connecting to:', maskedUri);

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

    console.log('✅ Successfully connected to database!');
    console.log('📊 Database name:', mongoose.connection.db?.databaseName);
    console.log('🔌 Connection state:', mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testConnection();




























