# Environment Variables for Zoho Email Service

## All Required Environment Variables

### Email Service Variables

| Variable Name | Value | Type | Required | Description |
|---|---|---|---|---|
| `ZOHO_EMAIL` | `your-email@zoho.com` | String | ✅ Yes | Zoho Mail email address for sending emails |
| `ZOHO_PASSWORD` | `app-password-or-account-password` | String | ✅ Yes | App password (if 2FA) or account password for Zoho authentication |
| `ZOHO_SMTP_HOST` | `smtp.zoho.com` | String | ✅ Yes | Zoho Mail SMTP server address (or regional variant) |
| `ZOHO_SMTP_PORT` | `465` | Number | ✅ Yes | SMTP port with SSL/TLS encryption (always 465) |

## How to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your **Fathom Legal** project
3. Click **Settings** in the top navigation
4. Click **Environment Variables** in the sidebar
5. Click **Add Environment Variable**
6. Fill in for each variable:
   - **Name:** (Variable name from table above)
   - **Value:** (Your actual value)
   - **Type:** Select appropriate environments

7. Click **Save**
8. Redeploy your application

**Important:** Ensure variables are added to:
- ✅ Production
- ✅ Preview
- ✅ Development

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to your Vercel account
vercel login

# Add environment variables
vercel env add ZOHO_EMAIL
vercel env add ZOHO_PASSWORD
vercel env add ZOHO_SMTP_HOST
vercel env add ZOHO_SMTP_PORT
```

### Method 3: Local Development (.env.local)

Create a `.env.local` file in your project root:

```env
ZOHO_EMAIL=your-email@zoho.com
ZOHO_PASSWORD=your-app-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

**Note:** `.env.local` is in `.gitignore` - it won't be committed to Git.

## Getting Your Values

### ZOHO_EMAIL

Your Zoho Mail email address. Examples:
- `noreply@company.zoho.com`
- `legal@yourdomain.com`
- `support@yourcompany.com`

**Where to find:**
- Check your Zoho account email
- Verify in Zoho Mail settings

### ZOHO_PASSWORD

**If you have 2FA enabled (recommended):**

1. Go to https://accounts.zoho.com/
2. Click **Security**
3. Scroll to **App Passwords**
4. Click on **Mail**
5. Click **Generate**
6. Copy the password (e.g., `btry bpdf kqcx mvyp`)
7. Use this as your `ZOHO_PASSWORD`

**If you DON'T have 2FA enabled:**

Use your regular Zoho account password. However, **we recommend enabling 2FA and using app passwords for security.**

**Important:** Never use your account password if 2FA is enabled - always use the app password.

### ZOHO_SMTP_HOST

Use one based on your region:

| Region | SMTP Host |
|---|---|
| 🌍 Global/US (Default) | `smtp.zoho.com` |
| 🇪🇺 Europe | `smtp.zoho.eu` |
| 🇮🇳 India | `smtp.zoho.in` |
| 🇯🇵 Japan | `smtp.zoho.jp` |
| 🇨🇳 China | `smtp.zoho.com.cn` |

**Default is `smtp.zoho.com`** - only change if your Zoho account is in a different region.

### ZOHO_SMTP_PORT

Always use: `465`

This is the standard SMTP port with SSL/TLS encryption used by Zoho Mail.

## Verification

After adding variables, verify by:

1. **Check Vercel Dashboard:**
   - Go to Project → Settings → Environment Variables
   - Confirm all 4 variables are listed
   - Status should show "Active"

2. **Test the Setup:**
   - Go to your deployed site: `https://your-domain/client-intake`
   - Book a test consultation
   - Check if confirmation email arrives

3. **Check Logs:**
   - Vercel Dashboard → Deployments → Most Recent
   - View logs for any email errors
   - Look for: `[v0] Email sent successfully via Zoho`

## Common Mistakes to Avoid

❌ **DON'T:**
- Use account password when 2FA is enabled (use app password instead)
- Include extra spaces in values
- Use different case than specified (e.g., `zoho_email` instead of `ZOHO_EMAIL`)
- Add variables only to Preview environment (add to Production too)
- Forget to redeploy after adding variables

✅ **DO:**
- Use app password when 2FA is enabled
- Copy-paste values carefully
- Use exact variable names from table
- Add to all environments (Production, Preview, Development)
- Redeploy after adding/changing variables

## After Deployment

### Step 1: Verify Variables Are Set

```bash
# This command shows which variables are set
vercel env ls
```

### Step 2: Redeploy

Trigger a new deployment:
- Push to your branch to auto-redeploy, OR
- Click "Redeploy" on a previous deployment

### Step 3: Test Email Sending

1. Go to `/client-intake` page
2. Complete Steps 1-2 (service selection and form)
3. On Step 3, select a date and time
4. Complete booking
5. Check your email inbox for confirmation

### Step 4: Monitor Logs

If email doesn't arrive:
1. Check Vercel deployment logs
2. Look for error messages with "Zoho"
3. Check spam/junk folder
4. Regenerate Zoho app password if needed

## Troubleshooting Quick Reference

| Error | Cause | Fix |
|---|---|---|
| "Email service not configured" | Missing environment variables | Add all 4 variables to Vercel |
| "Authentication failed" | Wrong password or email | Use app password; verify email address |
| "Connection timeout" | SMTP host unreachable | Check `ZOHO_SMTP_HOST` is correct for your region |
| "Invalid port" | Wrong SMTP port | Use port `465` |
| Email doesn't arrive | Service issue | Check spam folder; regenerate app password |

## Need Help?

1. **Review:** Read the full setup guide in `ZOHO_EMAIL_CONFIG.md`
2. **Reference:** Check `ZOHO_IMPLEMENTATION_SUMMARY.md` for details
3. **Quick Fix:** Look at `ZOHO_QUICK_START.md` for common issues
4. **Contact:** Reach out to development team with error messages from Vercel logs

## Summary of Required Action

1. ✅ Get Zoho email and password/app password
2. ✅ Go to Vercel Project → Settings → Environment Variables
3. ✅ Add 4 variables with exact names and values
4. ✅ Redeploy application
5. ✅ Test by booking a consultation
6. ✅ Verify confirmation email arrives

**That's it!** Your email service is now using Zoho Mail.
