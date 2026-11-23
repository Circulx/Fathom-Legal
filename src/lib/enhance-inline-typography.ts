'use client'

/**
 * Ensures TipTap inline font-size / font-family beat Tailwind Typography on the public page.
 * Also repairs invalid sizes like "24pxpx" from older editor saves.
 */
export function enhanceInlineTypography(html: string): string {
  if (!html) return html

  return html.replace(/style=(["'])(.*?)\1/gi, (_full, quote: string, styles: string) => {
    const parts = styles
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const colon = part.indexOf(':')
        if (colon === -1) return part
        const prop = part.slice(0, colon).trim().toLowerCase()
        let value = part.slice(colon + 1).trim()

        if (prop === 'font-size') {
          value = value.replace(/!important/gi, '').trim()
          // Repair "24pxpx" / normalize "24" → "24px"
          const match = value.match(/^(\d+(?:\.\d+)?)(?:px)?$/i)
          if (match) {
            value = `${match[1]}px`
          }
          return `font-size: ${value} !important`
        }

        if (prop === 'font-family') {
          value = value.replace(/!important/gi, '').trim()
          return `font-family: ${value} !important`
        }

        return part
      })

    return `style=${quote}${parts.join('; ')}${quote}`
  })
}
