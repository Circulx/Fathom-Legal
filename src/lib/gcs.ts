import { Storage } from '@google-cloud/storage'
import { Readable } from 'stream'

// Initialize GCS client
// Supports both service account JSON and environment variables
let storage: Storage | null = null

try {
  // Option 1: Use service account JSON file path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    })
  }
  // Option 2: Use service account JSON from environment variable
  else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    storage = new Storage({
      credentials
    })
  }
  // Option 3: Use default credentials (for GCP environments)
  else {
    storage = new Storage()
  }
} catch (error) {
  console.error('Error initializing GCS client:', error)
  storage = null
}

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || ''

if (!BUCKET_NAME) {
  console.warn('⚠️ GCS_BUCKET_NAME not set in environment variables')
}

/**
 * Upload a file to Google Cloud Storage
 * @param fileBuffer - Buffer containing the file data
 * @param fileName - Name of the file to store in GCS
 * @param contentType - MIME type of the file
 * @returns Promise<string> - GCS file path/URL
 */
export async function uploadToGCS(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  if (!storage) {
    throw new Error('GCS client not initialized. Please configure GCS credentials.')
  }

  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME not configured in environment variables')
  }

  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(`templates/${fileName}`)

  // Upload file
  await file.save(fileBuffer, {
    metadata: {
      contentType,
      cacheControl: 'private, max-age=0'
    }
  })

  // Note: With uniform bucket-level access enabled, we cannot set individual object permissions.
  // Access is controlled at the bucket level via IAM policies.
  // Files are private by default if the bucket has appropriate IAM settings.

  // Return the GCS path
  return `templates/${fileName}`
}

/**
 * Download a file from Google Cloud Storage
 * @param filePath - GCS file path (e.g., 'templates/filename.pdf')
 * @returns Promise<Buffer> - File buffer
 */
export async function downloadFromGCS(filePath: string): Promise<Buffer> {
  if (!storage) {
    throw new Error('GCS client not initialized. Please configure GCS credentials.')
  }

  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME not configured in environment variables')
  }

  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(filePath)

  // Check if file exists
  const [exists] = await file.exists()
  if (!exists) {
    throw new Error(`File not found in GCS: ${filePath}`)
  }

  // Download file as buffer
  const [buffer] = await file.download()

  return buffer
}

/**
 * Generate a signed URL for temporary access to a file
 * @param filePath - GCS file path
 * @param expiresInMinutes - URL expiration time in minutes (default: 60)
 * @returns Promise<string> - Signed URL
 */
export async function getSignedUrl(
  filePath: string,
  expiresInMinutes: number = 60
): Promise<string> {
  if (!storage) {
    throw new Error('GCS client not initialized. Please configure GCS credentials.')
  }

  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME not configured in environment variables')
  }

  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(filePath)

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000
  })

  return url
}

/**
 * Delete a file from Google Cloud Storage
 * @param filePath - GCS file path
 */
export async function deleteFromGCS(filePath: string): Promise<void> {
  if (!storage) {
    throw new Error('GCS client not initialized. Please configure GCS credentials.')
  }

  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME not configured in environment variables')
  }

  const bucket = storage.bucket(BUCKET_NAME)
  const file = bucket.file(filePath)

  await file.delete()
}

/**
 * Check if GCS is properly configured
 */
export function isGCSConfigured(): boolean {
  return storage !== null && BUCKET_NAME !== ''
}



