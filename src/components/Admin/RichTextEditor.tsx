'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Strikethrough, Image as ImageIcon } from 'lucide-react'
import { ResizableImage } from '@/lib/tiptap-extensions/ResizableImage'
import { BorderedParagraph } from '@/lib/tiptap-extensions/BorderedParagraph'
import { FontSize } from '@/lib/tiptap-extensions/FontSize'

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      BorderedParagraph,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  })

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const base64 = event.target?.result
        if (typeof base64 === 'string' && editor) {
          editor.chain().focus().setImage({ src: base64 }).run()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Helvetica',
    'Comic Sans MS',
  ]

  const fontSizes = [
    { label: '8px', value: '8' },
    { label: '10px', value: '10' },
    { label: '12px', value: '12' },
    { label: '14px', value: '14' },
    { label: '16px', value: '16' },
    { label: '18px', value: '18' },
    { label: '20px', value: '20' },
    { label: '24px', value: '24' },
    { label: '28px', value: '28' },
    { label: '32px', value: '32' },
    { label: '36px', value: '36' },
    { label: '48px', value: '48' },
  ]

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 bg-white">
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap items-center gap-2">
        <select
          value={editor.getAttributes('textStyle').fontFamily || ''}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run()
            } else {
              editor.chain().focus().unsetFontFamily().run()
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Default Font</option>
          {fontFamilies.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        <select
          value={editor.getAttributes('textStyle').fontSize || ''}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run()
            } else {
              editor.chain().focus().unsetFontSize().run()
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Font Size"
        >
          <option value="">Size</option>
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bold') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('italic') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('strike') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Bullet List"
        >
          <span className="text-sm font-bold">•</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Numbered List"
        >
          <span className="text-sm">1.</span>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Blockquote"
        >
          <span className="text-sm">"</span>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={handleImageUpload}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Insert Image (Upload)"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBorderedParagraph().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('borderedParagraph') ? 'bg-red-100 text-red-600' : 'text-gray-700'
          }`}
          title="Bordered Paragraph"
        >
          <span className="text-xs font-bold">□</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
