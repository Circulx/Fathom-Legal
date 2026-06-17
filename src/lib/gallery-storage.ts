import { del } from '@vercel/blob'

export function collectImageUrls(imageData: string | string[] | undefined): string[] {
  if (!imageData) return []
  const urls = Array.isArray(imageData) ? imageData : [imageData]
  return urls.filter((url): url is string => typeof url === 'string' && url.length > 0)
}

export async function deleteStoredImages(urls: string[]) {
  const blobUrls = urls.filter((url) => url.includes('blob.vercel-storage.com'))
  if (blobUrls.length === 0) return

  try {
    await del(blobUrls)
  } catch (error) {
    console.error('Failed to delete blob storage files:', error)
  }
}
