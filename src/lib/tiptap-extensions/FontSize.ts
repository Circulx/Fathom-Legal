import { Extension } from '@tiptap/core'

export interface FontSizeOptions {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

/** Normalize "24", "24px", "24 px" → "24" */
export function normalizeFontSizeValue(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = String(value).trim()
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*px$/i)
  if (match) return match[1]
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) return trimmed
  return trimmed
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => normalizeFontSizeValue(element.style.fontSize),
            renderHTML: (attributes) => {
              const size = normalizeFontSizeValue(attributes.fontSize)
              if (!size) return {}
              // Always emit a valid CSS length. Avoid "24pxpx" when value already has px.
              const cssSize = /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size
              return {
                style: `font-size: ${cssSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          const size = normalizeFontSizeValue(fontSize)
          if (!size) return false
          return chain().setMark('textStyle', { fontSize: size }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
        },
    }
  },
})
