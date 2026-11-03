// Google Search Console HTML-file verification.
// Served at /google3ac19e8e7b392a05.html (same content as the file Google provided).
export const dynamic = 'force-static'

export function GET() {
  return new Response('google-site-verification: google3ac19e8e7b392a05.html', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
