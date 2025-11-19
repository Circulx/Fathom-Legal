# Google Cloud Storage Setup Instructions

## Bucket Information
- **Bucket Name:** `fathomsupport-pdf-storage`

## Step-by-Step Setup

### 1. Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** > **Service Accounts**
3. Click **+ CREATE SERVICE ACCOUNT**
4. Fill in the details:
   - **Service account name:** `fathom-pdf-service` (or any name you prefer)
   - **Service account ID:** (auto-generated)
   - **Description:** `Service account for PDF storage in Fathom Legal`
5. Click **CREATE AND CONTINUE**

### 2. Grant Permissions

1. In the **Grant this service account access to project** section:
   - Click **Select a role**
   - Search for and select: **Storage Object Admin**
   - Click **CONTINUE**
2. Click **DONE**

### 3. Create and Download JSON Key

1. Find your newly created service account in the list
2. Click on the service account email
3. Go to the **KEYS** tab
4. Click **ADD KEY** > **Create new key**
5. Select **JSON** format
6. Click **CREATE**
7. **IMPORTANT:** The JSON file will download automatically. Save it securely!

### 4. Grant Bucket-Specific Permissions (Optional but Recommended)

For better security, you can grant permissions only to the specific bucket:

1. Go to **Cloud Storage** > **Buckets**
2. Click on `fathomsupport-pdf-storage`
3. Go to the **PERMISSIONS** tab
4. Click **GRANT ACCESS**
5. In **New principals**, enter your service account email (e.g., `fathom-pdf-service@fathomsupport.iam.gserviceaccount.com`)
6. Select role: **Storage Object Admin**
7. Click **SAVE**

### 5. Configure Environment Variables

#### For Local Development:

1. Place the downloaded JSON key file in your project root (or a secure location)
2. Add to `.env.local`:

```env
GCS_BUCKET_NAME=fathomsupport-pdf-storage
GOOGLE_APPLICATION_CREDENTIALS=./path/to/your-service-account-key.json
```

**Example:**
```env
GCS_BUCKET_NAME=fathomsupport-pdf-storage
GOOGLE_APPLICATION_CREDENTIALS=./gcs-credentials.json
```

#### For Production/Cloud Platforms (Vercel, etc.):

1. Open the downloaded JSON key file
2. Copy the entire JSON content
3. Add to your platform's environment variables:

```env
GCS_BUCKET_NAME=fathomsupport-pdf-storage
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"fathomsupport",...}
```

**Note:** Paste the entire JSON as a single-line string (no line breaks).

## Security Best Practices

1. **Never commit the JSON key file to Git**
   - Add `*.json` (or the specific filename) to `.gitignore`
   - The key file contains sensitive credentials

2. **Use least privilege principle**
   - Only grant "Storage Object Admin" (not "Storage Admin" or "Owner")
   - This limits access to only the storage bucket, not the entire project

3. **Rotate keys periodically**
   - Delete old keys when creating new ones
   - Update environment variables when rotating

## Testing the Setup

After configuration, test by:
1. Uploading a PDF through the admin panel
2. Check the console logs for: `✅ PDF uploaded to GCS: templates/{filename}`
3. Make a test purchase and download
4. Check the console logs for: `✅ PDF downloaded from GCS: templates/{filename}`

## Troubleshooting

### Error: "GCS client not initialized"
- Check that `GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_SERVICE_ACCOUNT_JSON` is set
- Verify the JSON file path is correct (for local development)

### Error: "GCS_BUCKET_NAME not configured"
- Ensure `GCS_BUCKET_NAME=fathomsupport-pdf-storage` is in your `.env.local`

### Error: "Permission denied" or "Access denied"
- Verify the service account has "Storage Object Admin" role
- Check that the service account email is granted access to the bucket
- Ensure the JSON key is for the correct service account

### Files not uploading to GCS
- Check console logs for error messages
- System will fall back to local storage if GCS fails
- Verify bucket name is correct (case-sensitive)


