# Zoho Email Service - Environment Variables Reference

## Quick Setup

Add these environment variables to your Vercel project settings:

### Required Variables

```
ZOHO_EMAIL=your-email@zoho.com
ZOHO_PASSWORD=your-app-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

## Where to Add Environment Variables

### Option 1: Vercel Dashboard (Production)

1. Go to your project dashboard: https://vercel.com/dashboard
2. Select your project
3. Click **Settings**
4. Navigate to **Environment Variables**
5. Add the following variables:

| Variable Name | Value | Description |
|---|---|---|
| `ZOHO_EMAIL` | `your-email@zoho.com` | Your Zoho Mail email address |
| `ZOHO_PASSWORD` | `your-app-password` | App password (not account password) |
| `ZOHO_SMTP_HOST` | `smtp.zoho.com` | Zoho SMTP server address |
| `ZOHO_SMTP_PORT` | `465` | Zoho SMTP port with SSL/TLS |

6. Click **Save**
7. Redeploy your application

### Option 2: Local Development (`.env.local`)

Create or edit `.env.local` in the project root:

```bash
ZOHO_EMAIL=your-email@zoho.com
ZOHO_PASSWORD=your-app-password
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

The dev server will automatically load these when you run `npm run dev`.

## Getting Your Zoho Credentials

### Step 1: Create a Zoho Account

Visit [Zoho Mail](https://www.zoho.com/mail/) and create an account if you don't have one.

### Step 2: Generate App Password

**If you have 2FA enabled (recommended):**

1. Go to [Zoho Account Settings](https://accounts.zoho.com/)
2. Click **Security**
3. Scroll to **App Passwords**
4. Select **Mail** as the application
5. Select **Windows Mail** or **Other** as device type
6. Click **Generate**
7. Copy the generated password (e.g., `btry bpdf kqcx mvyp`)
8. Use this as your `ZOHO_PASSWORD` value

**If you don't have 2FA enabled:**

You can use your regular Zoho account password as `ZOHO_PASSWORD`. However, **enabling 2FA with app passwords is strongly recommended for security**.

### Step 3: Note Your Email Address

Your Zoho email address will be your `ZOHO_EMAIL` value.

Examples:
- `noreply@company.zoho.com`
- `support@yourdomain.com`
- `legal@yourdomain.com`

## SMTP Configuration Details

| Parameter | Value | Description |
|---|---|---|
| Host | `smtp.zoho.com` | Global Zoho SMTP server |
| Port | `465` | Standard SMTP SSL/TLS port |
| Security | SSL/TLS | Always use encrypted connection |
| Authentication | Required | Username and password |

## Regional SMTP Servers

If you're outside the US, use the appropriate server:

| Region | SMTP Host | Notes |
|---|---|---|
| Global/US | `smtp.zoho.com` | Default for most users |
| Europe | `smtp.zoho.eu` | For EU-based accounts |
| India | `smtp.zoho.in` | For India-based accounts |
| China | `smtp.zoho.com.cn` | For China region |
| Japan | `smtp.zoho.jp` | For Japan-based accounts |

If using a regional server, update `ZOHO_SMTP_HOST` accordingly.

## Troubleshooting

### "Email service not configured" Error

**Cause:** Environment variables are not set or have typos.

**Solution:**
1. Verify all 4 variables are added to Vercel dashboard
2. Check for extra spaces (leading/trailing)
3. Verify capitalization (case-sensitive)
4. Redeploy after adding variables

### "Authentication failed" Error

**Cause:** Wrong password or email address.

**Solution:**
1. Confirm you're using the **app password**, not your account password (if 2FA enabled)
2. Regenerate the app password and try again
3. Verify the email address is correct and formatted properly
4. Check your Zoho account isn't locked

### "Connection refused" Error

**Cause:** SMTP server unreachable or port blocked.

**Solution:**
1. Verify you're using the correct regional server
2. Check firewall settings (port 465 should be open)
3. Verify network connectivity
4. Contact Zoho support if issue persists

### Emails Not Sending But No Error

**Cause:** Email credentials work but there's another issue.

**Solution:**
1. Check server logs in Vercel deployment
2. Verify recipient email address is valid
3. Check spam/junk folder
4. Review Zoho Mail account for suspicious activity

## Email Flow

When a user books a consultation:

1. User completes the intake form (Step 1-2)
2. User selects date and time (Step 3)
3. API endpoint `/api/intake/send-email` is called
4. System uses Zoho SMTP to send confirmation email
5. User receives email with:
   - Consultation details (date, time, duration)
   - Google Meet link
   - Pre-meeting checklist
   - Rescheduling instructions

## Code Implementation

The email service is implemented in:
- **File:** `src/app/api/intake/send-email/route.ts`
- **Trigger:** When user completes consultation booking
- **Provider:** Zoho Mail via Nodemailer

## Security Notes

✓ Never commit `.env.local` to Git (it's in `.gitignore`)  
✓ Use app passwords instead of account passwords  
✓ Enable 2FA on your Zoho account  
✓ Rotate app passwords periodically  
✓ Don't share credentials in logs or error messages  
✓ Use different email addresses for different services  

## Support Resources

- [Zoho Mail Help Center](https://www.zoho.com/mail/help/)
- [Zoho SMTP Configuration Guide](https://www.zoho.com/mail/help/mail-client.html)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Additional Notes

- Emails are sent with `from: ZOHO_EMAIL` and `replyTo: ZOHO_EMAIL`
- The email includes professional HTML formatting
- Delivery failures don't block booking confirmation (booking is still saved in database)
- Check Zoho Mail's sent folder to verify successful sends
- Maximum email size limit depends on Zoho Mail plan

## Need to Switch Back to Gmail?

If you want to revert to Gmail, simply:

1. Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to environment variables
2. Update `src/app/api/intake/send-email/route.ts` to use Gmail service
3. Redeploy

Contact the development team if you need assistance with the switch.
