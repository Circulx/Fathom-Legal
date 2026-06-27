# Zoho Mail Authentication Troubleshooting Guide

## Error: "535 Authentication Failed"

This error means your Zoho credentials are incorrect or improperly configured. Follow these steps to fix it.

---

## Step 1: Verify Your Credentials

### Check Email Address
```
Your email should be in the format: your-email@zoho.com
NOT: your-name@yourdomain.com (custom domain)
```

**If using a custom domain:**
- Get your actual Zoho email (usually sent in welcome email)
- Or go to Zoho Mail Settings → Accounts → find your Zoho email
- Use that for ZOHO_EMAIL

### Check if 2FA is Enabled
1. Log in to https://accounts.zoho.com
2. Go to **My Account** → **Security**
3. Look for "Two-Factor Authentication"

**If 2FA is ON:**
- You MUST use an **app password**, NOT your account password
- Instructions below to generate app password

**If 2FA is OFF:**
- You can use your account password directly

---

## Step 2: Generate App Password (If 2FA is Enabled)

**IMPORTANT:** Only needed if you have 2FA enabled

### Steps to Generate App Password:

1. Go to https://accounts.zoho.com
2. Click your **Profile Picture** → **Account Settings**
3. Go to **Security** tab on the left
4. Scroll to **Two-Factor Authentication**
5. Find **"Generate App Specific Password"** or **"Create New App Password"**
6. Select:
   - **Application:** Mail
   - **Device:** Other (or your server type)
7. Click **Generate**
8. Copy the generated password (16-character code)

### Update Your Environment Variable:
```
ZOHO_PASSWORD = [paste the 16-character app password here]
```

---

## Step 3: Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Verify all 4 variables exist AND are identical:

| Variable | Value | Example |
|----------|-------|---------|
| ZOHO_EMAIL | your@zoho.com | client.accounts@fathomlegal.com |
| ZOHO_PASSWORD | app password or account password | xxxxxxxxxxxxxxxx |
| ZOHO_SMTP_HOST | smtp.zoho.com (or regional) | smtp.zoho.com |
| ZOHO_SMTP_PORT | 465 | 465 |

### Check Region (Important!)
Different regions have different SMTP servers:

```
Global/US (Default):  smtp.zoho.com      ← Most common
Europe:               smtp.zoho.eu
India:                smtp.zoho.in
Japan:                smtp.zoho.jp
China:                smtp.zoho.com.cn
```

If your Zoho account is in a different region, update ZOHO_SMTP_HOST accordingly.

---

## Step 4: Redeploy Your Application

After adding/updating environment variables:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Find your latest deployment
4. Click the **three dots** → **Redeploy**
5. Wait for redeployment to complete

---

## Step 5: Test the Connection

1. Visit your application: `https://your-domain/client-intake`
2. Fill out the consultation form
3. Complete the booking
4. Check:
   - Does the confirmation page show?
   - Do you receive a confirmation email?

### Check Logs
1. Go to Vercel Dashboard → Logs
2. Look for recent POST requests to `/api/intake/send-email`
3. Check the response:
   - `"emailSent": true` = Success ✓
   - `"emailSent": false` = Failed ✗

---

## Common Mistakes & Fixes

### ❌ Mistake 1: Using Account Password Instead of App Password
**Problem:** You have 2FA enabled but using your account password
**Fix:** Generate and use the app password (see Step 2 above)

### ❌ Mistake 2: Wrong Email Address
**Problem:** Using custom domain email instead of Zoho email
**Fix:** Use your actual Zoho email (ends with @zoho.com)

### ❌ Mistake 3: Email Address Not Verified
**Problem:** Zoho email account exists but not verified
**Fix:** Check your email for Zoho verification link; click it

### ❌ Mistake 4: Environment Variables Not Added to Production
**Problem:** Variables added but not visible in Production environment
**Fix:** When adding variables, explicitly select:
- ✓ Production
- ✓ Preview
- ✓ Development

### ❌ Mistake 5: Wrong SMTP Server for Region
**Problem:** Using smtp.zoho.com but your account is in EU
**Fix:** Change ZOHO_SMTP_HOST to smtp.zoho.eu (or appropriate region)

### ❌ Mistake 6: Special Characters in Password
**Problem:** App password has spaces or special characters
**Fix:** Copy the entire password as-is, including any special characters

---

## Debug Information

If you're still having issues, collect this debug info:

1. **From Vercel Logs**, look for output like:
```
[v0] Zoho email auth initializing for user: client.accounts@fathomlegal.com
[v0] Zoho SMTP config: { host: 'smtp.zoho.com', port: 465, secure: true }
[v0] Zoho email sending failed: {
  error: '535 Authentication Failed',
  code: 'EAUTH',
  response: '535 Authentication Failed',
  smtpServer: 'smtp.zoho.com',
  smtpPort: 465
}
```

2. **Share this info when asking for help:**
   - Error message (the entire error)
   - ZOHO_EMAIL value (first and last 3 chars only, e.g., clie...com)
   - ZOHO_SMTP_HOST value
   - ZOHO_SMTP_PORT value
   - Whether 2FA is enabled on your Zoho account

---

## Test Connection Without Sending Email

To test if your Zoho credentials work (without sending email):

1. Open a terminal/command prompt
2. Run this test (replace values):

```bash
# Test using telnet (checks if server is reachable)
telnet smtp.zoho.com 465

# If you want to test with Node.js:
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'your-email@zoho.com',
    pass: 'your-app-password'
  }
});
transporter.verify((err, success) => {
  if (err) console.log('ERROR:', err);
  else console.log('Connection OK:', success);
});
"
```

---

## Still Not Working?

Try these additional fixes:

### 1. Regenerate App Password
- Even if you have one, regenerate it
- Delete the old one and create a new one
- Use the new password in ZOHO_PASSWORD

### 2. Create a New Zoho Mail Account
- If available, test with a different Zoho email address
- This helps identify if it's account-specific issue

### 3. Check Zoho Account Status
- Log in to https://mail.zoho.com
- Verify you can send email manually from there
- If not, your account might have issues

### 4. Check Firewall/Network
- If running locally, your ISP might block SMTP port 465
- Try switching networks to test
- Try using TLS instead (port 587)

### 5. Contact Zoho Support
- If none of above work, contact Zoho support
- Provide them with: your email, region, and error message
- They can verify your account and credentials

---

## Success Indicators

Once fixed, you should see:

✓ **In Vercel Logs:**
```
[v0] Email sent successfully via Zoho: <[email protected]>
```

✓ **In User Email Inbox:**
- Confirmation email arrives within 30 seconds
- Email shows your company branding
- Email has correct consultation details

✓ **In Vercel Logs (success response):**
```
{ "emailSent": true, "hasError": false }
```

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| 535 Authentication Failed | Regenerate app password |
| Connection Timeout | Change ZOHO_SMTP_HOST to your region |
| Email Never Arrives | Check spam folder; check ZOHO_EMAIL spelling |
| Env vars not working | Redeploy after adding variables |
| Can't log in to Zoho | Use forgotten password to reset |

---

**Still need help?** Check the logs in Vercel for the exact error message and error code, then refer back to this guide.
