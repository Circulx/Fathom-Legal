# Gmail SMTP Email Configuration Guide

## Problem
The email sending feature is failing with error: **"Invalid login: 535-5.7.8 Username and Password not accepted"**

This means the Gmail App Password in your environment variables is either:
- Expired or invalid
- Never generated properly
- From an account without 2-Step Verification enabled

## Solution - Step by Step

### Step 1: Enable 2-Step Verification (if not already done)
1. Go to https://myaccount.google.com
2. Click **Security** in the left sidebar
3. Scroll down to "How you sign in to Google"
4. Click **2-Step Verification**
5. Follow the prompts to enable it (you'll need your phone)
6. Once enabled, you'll see a green checkmark

### Step 2: Generate Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. You should see "App passwords" option
3. Select:
   - **App**: Mail
   - **Device**: Windows Computer (or your device type)
4. Click **Generate**
5. Google will show you a 16-character password (with spaces like: `vtck vzpb mdxv bgzr`)
6. **Copy the entire password** (including spaces)

### Step 3: Update Your Environment Variables

#### For Local Development (.env.development.local):
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=vtck vzpb mdxv bgzr
```

#### For Vercel Production:
1. Go to your Vercel project settings
2. Go to **Environment Variables**
3. Add or update:
   - `GMAIL_USER` = your Gmail address
   - `GMAIL_APP_PASSWORD` = 16-character password from Step 2

### Step 4: Test the Configuration
Run this command to verify your credentials:

```bash
curl http://localhost:3000/api/intake/test-email
```

**Expected response if working:**
```json
{
  "status": "SUCCESS",
  "message": "Gmail SMTP connection verified successfully",
  "details": {
    "gmailUser": "your-email@gmail.com",
    "passwordLength": 16,
    "host": "smtp.gmail.com",
    "port": 465
  }
}
```

**If still failing:**
```json
{
  "status": "FAILED",
  "message": "Gmail SMTP connection failed",
  "error": "Invalid login: 535-5.7.8...",
  "details": {
    "code": "EAUTH"
  }
}
```

If failing, try these:
1. Verify 2-Step Verification is enabled (green checkmark at myaccount.google.com)
2. Delete the old app password and generate a NEW one
3. Copy the FULL 16-character password including spaces exactly as shown
4. Update environment variables and restart the app

### Step 5: Restart Development Server

After updating environment variables, restart your dev server:
```bash
npm run dev
```

## How Email Sending Works

**When user completes Step 3 (calendar booking):**
1. Form data is submitted
2. Email route attempts to send confirmation email
3. If email succeeds: User sees "Confirmation email sent!"
4. If email fails: User still proceeds to Step 4 and sees "Booking confirmed!" - the booking is ALWAYS saved

**Step 4 displays:**
- Full appointment details
- Google Meet link (clickable button)
- Pre-consultation checklist
- Reschedule instructions

**Email contains:**
- All consultation details
- Google Meet link (as button + text)
- Pre-consultation checklist
- Reschedule instructions
- Professional HTML formatting

## Troubleshooting

### Error: "Gmail credentials not configured"
- Check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` environment variables are set
- For local dev, check `.env.development.local` file exists
- For production, check Vercel project environment variables

### Error: "Invalid login 535-5.7.8"
- Your Gmail App Password is wrong or expired
- Go to https://myaccount.google.com/apppasswords and generate a NEW password
- Copy the full 16 characters (with spaces)
- Update your environment variables

### Error: "Gmail connection timeout"
- Firewall might be blocking port 465
- Try using your corporate VPN if behind a firewall
- Check your internet connection

### Email sent but user didn't receive it
1. Check spam/junk folder
2. Verify email address in form is correct
3. Check Gmail account isn't blocked
4. Resend from Step 4 confirmation (via "Resend Email" button if implemented)

## Alternative Solutions

If Gmail is problematic, you can switch to:

### SendGrid
```
npm install @sendgrid/mail
```

### Mailgun
```
npm install mailgun.js
```

### Brevo (formerly Sendinblue)
```
npm install brevo
```

Contact development team if you need to switch email providers.

## Testing Email Endpoint

Test your Gmail configuration anytime:

```bash
# Local
curl http://localhost:3000/api/intake/test-email

# Production  
curl https://your-domain.com/api/intake/test-email
```

This endpoint will verify SMTP connection without sending actual emails.

---

**Note**: The booking system is designed to be resilient - emails enhance the user experience but are not required for the booking to be confirmed. Users always get their confirmation details on the Step 4 confirmation page with the Google Meet link.
