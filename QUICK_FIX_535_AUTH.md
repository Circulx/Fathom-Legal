# Quick Fix: "535 Authentication Failed" Error

You're getting this error when trying to send emails via Zoho. Follow this checklist to fix it immediately.

---

## Checklist (Do These in Order)

### ✓ Check 1: Email Address Format
- [ ] Your ZOHO_EMAIL ends with **@zoho.com**?
  - ✓ Correct: `client.accounts@zoho.com`
  - ✗ Wrong: `client.accounts@fathomlegal.com` (custom domain)
  - **Action:** If using custom domain, find your actual Zoho email in welcome email

### ✓ Check 2: Is 2FA Enabled?
- [ ] Go to https://accounts.zoho.com → Security
- [ ] Look for "Two-Factor Authentication"
- [ ] If **YES** → Go to Check 3
- [ ] If **NO** → Go to Check 4

### ✓ Check 3: Using App Password? (Only if 2FA is ON)
- [ ] You're using an **app-specific password** (16 characters)
- [ ] NOT your regular account password
- **If you don't have one:**
  1. Go to https://accounts.zoho.com
  2. Click Profile → Account Settings
  3. Go to Security tab
  4. Find "Generate App Specific Password"
  5. Select: Application = Mail, Device = Other
  6. Copy the 16-character password
  7. Update ZOHO_PASSWORD in Vercel

### ✓ Check 4: Environment Variables in Vercel
- [ ] Go to Vercel → Project Settings → Environment Variables
- [ ] All 4 variables exist?
  - [ ] ZOHO_EMAIL: `your-email@zoho.com`
  - [ ] ZOHO_PASSWORD: `your-app-password` (or account password if no 2FA)
  - [ ] ZOHO_SMTP_HOST: `smtp.zoho.com`
  - [ ] ZOHO_SMTP_PORT: `465`
- [ ] All variables set to ALL environments?
  - [ ] Production: ✓
  - [ ] Preview: ✓
  - [ ] Development: ✓

### ✓ Check 5: Correct SMTP Server for Region
- [ ] What region is your Zoho account in?
  - [ ] Global/US → `smtp.zoho.com` (default)
  - [ ] Europe → `smtp.zoho.eu`
  - [ ] India → `smtp.zoho.in`
  - [ ] Japan → `smtp.zoho.jp`
  - [ ] China → `smtp.zoho.com.cn`
- [ ] Update ZOHO_SMTP_HOST if needed

### ✓ Check 6: Redeploy Application
- [ ] Go to Vercel → Deployments
- [ ] Find your latest deployment
- [ ] Click **three dots** → **Redeploy**
- [ ] Wait for green checkmark (deployment complete)

### ✓ Check 7: Test
- [ ] Visit your app: `https://your-domain/client-intake`
- [ ] Fill form and submit
- [ ] Check Vercel logs: `POST /api/intake/send-email`
- [ ] Look for success or error message

---

## Expected Results After Fix

✓ **Success (You'll See):**
```
[v0] Zoho email auth initializing for user: client.accounts@fathomlegal.com
[v0] Sending email to: 21cs3039@rgipt.ac.in
[v0] Email sent successfully via Zoho: <[email protected]>
```

✗ **Still Failing (Keep Going):**
```
[v0] Zoho email sending failed: {
  error: 'Invalid login: 535 Authentication Failed'
}
```

---

## Most Common Fixes

**99% of the time, it's ONE of these:**

1. **Using account password instead of app password**
   - Solution: Generate app password (see Check 3)

2. **Wrong email address (custom domain instead of @zoho.com)**
   - Solution: Find your actual Zoho email

3. **Variables not added to Production environment**
   - Solution: Add to ALL three environments (Production, Preview, Development)

4. **Forgot to redeploy after adding variables**
   - Solution: Go to Vercel → Redeploy

5. **Wrong SMTP server for your region**
   - Solution: Update ZOHO_SMTP_HOST to your region

---

## If Still Not Working

Do this in order:

1. **Regenerate app password**
   - Even if you have one, generate a new one
   - Delete the old one
   - Use the new password

2. **Verify Zoho account works**
   - Log into https://mail.zoho.com
   - Try sending an email manually
   - If you can't, your account has issues

3. **Check your email is verified**
   - Zoho requires email verification
   - Check your email for "verify your Zoho account" link
   - Click it if present

4. **Clear browser cache**
   - Clear Vercel site cache: go to Vercel → Deployments → Redeploy

5. **Check Firewall/Network**
   - Try from different network/device
   - Some ISPs block SMTP port 465

6. **Contact Zoho Support**
   - Email: support@zoho.com
   - Provide: your email, region, and error

---

## Debug: Check Your Credentials

To verify your email and password work:

```bash
# Test command (replace values):
telnet smtp.zoho.com 465
```

If telnet connects → Server is reachable ✓  
If telnet fails → Check your network/firewall

---

## Configuration Summary

**Current Configuration:**
```
ZOHO_EMAIL=client.accounts@fathomlegal.com
ZOHO_PASSWORD=[your-app-password-here]
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
```

**Things to double-check:**
- [ ] Email spelling correct?
- [ ] Password is app-specific (if 2FA on)?
- [ ] SMTP host matches your region?
- [ ] Port is 465 (not 587)?

---

## Next Steps

1. ✓ Complete all checks above
2. ✓ Redeploy your application
3. ✓ Test by booking a consultation
4. ✓ Check inbox for confirmation email
5. ✓ Check Vercel logs for success

That's it! The error should be fixed.

---

**Need more help?** Read the full troubleshooting guide: `ZOHO_AUTH_TROUBLESHOOTING.md`
