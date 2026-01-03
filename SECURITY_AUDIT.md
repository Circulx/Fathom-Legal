# Security Audit Report - Fathom Legal

**Date:** January 3, 2026  
**Status:** ⚠️ **CRITICAL ISSUES FOUND**

## 🔴 CRITICAL VULNERABILITIES

### 1. Admin API Routes Not Protected
**Severity:** CRITICAL  
**Location:** `src/middleware.ts:12`

**Issue:** Admin API routes bypass authentication middleware
```typescript
if (pathname.startsWith('/api/admin/')) {
  return NextResponse.next()  // ⚠️ No authentication check!
}
```

**Impact:** Anyone can access admin endpoints without authentication

**Fix Required:**
- Remove the exception for `/api/admin/` routes
- Add authentication checks in each admin API route handler
- Use NextAuth session verification

---

### 2. XSS Vulnerability via dangerouslySetInnerHTML
**Severity:** CRITICAL  
**Locations:**
- `src/components/BlogContent.tsx:33`
- `src/app/admin/dashboard/page.tsx:2387, 2764`

**Issue:** Unsanitized HTML content is rendered directly

**Impact:** Malicious scripts can execute in user browsers

**Fix Required:**
```typescript
import DOMPurify from 'isomorphic-dompurify'

// Before rendering
const sanitizedContent = DOMPurify.sanitize(content)
```

---

### 3. MongoDB Regex Injection
**Severity:** HIGH  
**Locations:** Multiple API routes using `$regex`

**Issue:** User input used directly in regex without escaping
```typescript
{ title: { $regex: search, $options: 'i' } }
```

**Impact:** DoS attacks, query manipulation

**Fix Required:**
```typescript
// Escape special regex characters
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
{ title: { $regex: escapeRegex(search), $options: 'i' } }
```

---

## 🟠 HIGH PRIORITY ISSUES

### 4. No Rate Limiting
**Severity:** HIGH  
**Impact:** Brute force attacks, DoS, API abuse

**Fix Required:**
- Install `@upstash/ratelimit` or similar
- Add rate limiting to:
  - Login endpoints
  - File upload endpoints
  - Payment endpoints
  - API routes

---

### 5. No CSRF Protection
**Severity:** HIGH  
**Impact:** Cross-site request forgery attacks

**Fix Required:**
- Add CSRF tokens for state-changing operations
- Use Next.js built-in CSRF protection

---

### 6. File Upload Security Gaps
**Severity:** HIGH  
**Location:** `src/app/api/admin/templates/upload/route.ts`

**Issues:**
- File type validation relies on `file.type` (spoofable)
- No content-based validation (magic bytes)
- Large file sizes (50MB) enable DoS

**Fix Required:**
- Validate file content using magic bytes
- Add stricter size limits
- Scan files for malware (optional but recommended)

---

## 🟡 MEDIUM PRIORITY ISSUES

### 7. Weak Email Validation
**Severity:** MEDIUM  
**Location:** `src/app/api/templates/[id]/download/route.ts`

**Fix Required:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
}
```

---

### 8. Information Disclosure in Errors
**Severity:** MEDIUM  
**Impact:** Stack traces may leak sensitive information

**Fix Required:**
- Ensure production never exposes stack traces
- Use generic error messages in production

---

### 9. Password Security
**Severity:** MEDIUM  
**Location:** `src/models/Admin.ts`

**Fix Required:**
- Verify bcrypt is used with salt rounds >= 10
- Enforce strong password policies

---

## 🟢 LOW PRIORITY / RECOMMENDATIONS

### 10. Security Headers
**Fix Required:**
```typescript
// next.config.js
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Content-Security-Policy', value: "default-src 'self'" },
    ],
  },
]
```

---

### 11. CORS Configuration
**Fix Required:**
- Configure CORS to allow only trusted origins
- Remove wildcard CORS if present

---

## ✅ SECURITY STRENGTHS

1. ✅ **Payment Security:** Razorpay signature verification is properly implemented
2. ✅ **Environment Variables:** Secrets are properly stored in environment variables
3. ✅ **Password Hashing:** Using bcryptjs for password hashing
4. ✅ **File Upload Validation:** Basic file type and size validation exists
5. ✅ **Database:** Using Mongoose which provides some injection protection
6. ✅ **Authentication:** NextAuth is properly configured with JWT

---

## 📋 ACTION ITEMS

### Immediate (Critical)
- [ ] Fix admin API route authentication
- [ ] Sanitize HTML content before rendering
- [ ] Escape regex input in MongoDB queries

### Short Term (High Priority)
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Improve file upload validation

### Medium Term (Medium Priority)
- [ ] Strengthen email validation
- [ ] Review error handling
- [ ] Audit password policies

### Long Term (Low Priority)
- [ ] Add security headers
- [ ] Configure CORS properly
- [ ] Security monitoring and logging

---

## 🔗 RESOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

