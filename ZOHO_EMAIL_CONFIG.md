# Zoho Mail Email Service Configuration

This guide explains how to set up Zoho Mail as the email service provider for Fathom Legal's consultation booking system.

## Required Environment Variables

Add the following environment variables to your Vercel project settings (`.env.local` for local development or Vercel dashboard for production):

```
ZOHO_EMAIL=your-zoho-email@zoho.com
ZOHO_PASSWORD=your-zoho-app-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

## Step-by-Step Setup Guide

### 1. Create or Use Your Zoho Account

- Visit [Zoho Mail](https://www.zoho.com/mail/) and sign up or log in
- Create a new email address or use an existing one from your Zoho workspace
- Example: `noreply@yourdomain.com` or `legal@yourdomain.com`

### 2. Generate App Password (Two-Factor Authentication)

If your Zoho account has Two-Factor Authentication (2FA) enabled:

1. Go to [Zoho Account Settings](https://accounts.zoho.com/)
2. Navigate to **Security** → **App Passwords**
3. Select **Mail** as the application
4. Select **Windows Mail** as the device type (or choose appropriate device)
5. Click **Generate**
6. Copy the generated password

**Important:** This is different from your regular Zoho password. Use this app password in `ZOHO_PASSWORD`.

### 3. If 2FA is NOT Enabled

If you don't have 2FA enabled, you can use your regular Zoho account password. However, 2FA with app passwords is **highly recommended** for security.

### 4. Configure Environment Variables

#### Local Development (`.env.local`):

```bash
ZOHO_EMAIL=your-email@zoho.com
ZOHO_PASSWORD=your-app-password-or-account-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

#### Production (Vercel Dashboard):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** `ZOHO_EMAIL` | **Value:** `your-email@zoho.com`
   - **Name:** `ZOHO_PASSWORD` | **Value:** `your-app-password`
   - **Name:** `ZOHO_SMTP_HOST` | **Value:** `smtp.zoho.com`
   - **Name:** `ZOHO_SMTP_PORT` | **Value:** `465`

4. Click **Save**
5. Redeploy your application for changes to take effect

## SMTP Server Details

- **SMTP Host:** `smtp.zoho.com`
- **SMTP Port:** `465` (with SSL/TLS encryption)
- **Security:** SSL/TLS (Required)
- **Authentication:** Required (yes)

## Testing the Configuration

To verify your setup:

1. Book a consultation through the intake form
2. Complete the scheduling process
3. Check if confirmation email is received
4. Check the server logs for any errors:
   ```
   [v0] Zoho email auth initializing for user: your-email@zoho.com
   [v0] Email sent successfully via Zoho: <message-id>
   ```

## Troubleshooting

### Email Not Sending

**Error:** "Email service not configured"
- **Solution:** Verify all environment variables are set correctly in Vercel dashboard
- Check for typos in `ZOHO_EMAIL` and `ZOHO_PASSWORD`
- Ensure values are trimmed (no extra spaces)

**Error:** "Invalid login credentials"
- **Solution:** Confirm you're using the app password (if 2FA enabled), not your regular password
- Re-generate the app password if unsure
- Verify the email address is correct

**Error:** "Connection timeout"
- **Solution:** Check your Zoho account isn't locked
- Verify firewall isn't blocking port 465
- Check network connectivity

### Emails Going to Spam

1. Add Fathom Legal's domain to Zoho's trusted senders
2. Ensure SPF, DKIM, and DMARC records are configured
3. Ask test recipients to mark emails as "Not Spam"

## Alternative Zoho Plans

If you need a custom domain:
1. Use **Zoho Workspace** with your custom domain
2. Create email addresses under that domain
3. Generate app passwords the same way
4. Update `ZOHO_EMAIL` to your custom domain email

## Regional Zoho Servers

If you're in a different region, use the appropriate SMTP server:

- **Global/US:** `smtp.zoho.com`
- **EU:** `smtp.zoho.eu`
- **India:** `smtp.zoho.in`
- **China:** `smtp.zoho.com.cn`
- **Japan:** `smtp.zoho.jp`

Update `ZOHO_SMTP_HOST` accordingly.

## Security Best Practices

✓ Use app passwords instead of account passwords  
✓ Enable Two-Factor Authentication on your Zoho account  
✓ Keep environment variables secure (don't commit to Git)  
✓ Use different email addresses for different services  
✓ Regularly audit email sending logs  
✓ Set up email forwarding for important notifications  

## Support

For Zoho Mail support, visit: [Zoho Mail Help Center](https://www.zoho.com/mail/help/)

For application-specific issues, check the server logs in your Vercel deployment.
