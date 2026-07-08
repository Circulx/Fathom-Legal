import mongoose from 'mongoose'

declare global {
  var mongoose: any
  var mongooseConnectionListeners: boolean | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

if (!global.mongooseConnectionListeners) {
  global.mongooseConnectionListeners = true
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected, clearing connection cache')
    cached.conn = null
    cached.promise = null
  })
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err)
    cached.conn = null
    cached.promise = null
  })
}

async function connectDB() {
  // Check if we're already connected to the right database
  if (cached.conn && mongoose.connection.readyState === 1) {
    const currentDb = mongoose.connection.db?.databaseName
    console.log('🔍 Already connected to database:', currentDb)
    
    // If we're connected to the wrong database, close and reconnect
    if (currentDb !== 'fathomlegal_admin') {
      console.log('🔄 Wrong database detected, reconnecting...')
      await mongoose.connection.close()
      cached.conn = null
      cached.promise = null
    } else {
      return cached.conn
    }
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4,
    }

    console.log('🔗 Connecting to MongoDB with URI:', MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ Connected to database:', mongoose.connection.db?.databaseName)
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    cached.conn = null
    throw e
  }

  return cached.conn
}

export { connectDB }
export default connectDB
