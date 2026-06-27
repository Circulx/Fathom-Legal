# Zoho Email Service - Quick Start Guide

## 5-Minute Setup

### 1. Get Zoho Email Address
- Already have one? Use it
- Don't have one? Sign up at https://www.zoho.com/mail/

### 2. Generate App Password (if 2FA enabled)
```
Account Settings → Security → App Passwords → Generate
```
Copy the password you see

### 3. Add to Vercel
Go to: **Your Project Dashboard → Settings → Environment Variables**

Add these 4 variables:

```
ZOHO_EMAIL = your-email@zoho.com
ZOHO_PASSWORD = (paste the app password or account password)
ZOHO_SMTP_HOST = smtp.zoho.com
ZOHO_SMTP_PORT = 465
```

Click **Save** and **Redeploy**

### 4. Test It
1. Go to `/client-intake`
2. Book a consultation
3. Check your email for confirmation

Done! ✓

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| "Email service not configured" | Check all 4 env vars are in Vercel |
| "Authentication failed" | Use app password (if 2FA on), not account password |
| Email doesn't arrive | Check spam folder or regenerate app password |
| Connection error | Verify ZOHO_SMTP_PORT is `465` |

## Need Different Region?

Change `ZOHO_SMTP_HOST` to:
- 🇪🇺 Europe: `smtp.zoho.eu`
- 🇮🇳 India: `smtp.zoho.in`
- 🇯🇵 Japan: `smtp.zoho.jp`

## Files Changed

- ✅ `src/app/api/intake/send-email/route.ts` - Updated to use Zoho
- 📄 `ZOHO_EMAIL_CONFIG.md` - Full configuration guide
- 📄 `ENV_VARIABLES_ZOHO.md` - Environment variables reference

## Questions?

1. Check `ZOHO_EMAIL_CONFIG.md` for detailed setup
2. Check `ENV_VARIABLES_ZOHO.md` for troubleshooting
3. Visit [Zoho Mail Help](https://www.zoho.com/mail/help/)

That's it! Your email service is now using Zoho.
