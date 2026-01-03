'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Placeholder from '@tiptap/extension-placeholder'
import { ResizableImage } from '@/lib/tiptap-extensions/ResizableImage'
import { BorderedParagraph } from '@/lib/tiptap-extensions/BorderedParagraph'
import { FontSize } from '@/lib/tiptap-extensions/FontSize'
import { 
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Camera,
  Users,
  User,
  Package,
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  Plus,
  Upload,
  Download,
  Trash2,
  X,
  LogOut,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Edit
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'

interface Template {
  _id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  tags: string[]
  downloadCount: number
  price: number
  imageUrl?: string // Legacy field
  imageData?: string // Base64 data URL (preferred)
  createdAt: string
  uploadedBy: {
    name: string
    email: string
  }
  isCustom?: boolean
  customOptions?: Array<{
    name: string
    price: number
    description: string
    features: string[]
    calendlyLink?: string
    contactEmail?: string
  }>
  defaultCalendlyLink?: string
  defaultContactEmail?: string
}

interface GalleryItem {
  _id: string
  title: string
  description: string
  imageData: string | string[] // Can be string (legacy) or array (new)
  imageType: string
  isActive: boolean
}

interface Blog {
  _id: string
  title: string
  description: string
  category: 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS'
  content?: string
  externalUrl?: string
  imageUrl?: string
  logoUrl?: string
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

// Rich Text Editor Component with Toolbar
function RichTextEditor({ 
  value, 
  onChange, 
  placeholder 
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
        placeholder: '',
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  })

  // Handle image upload
  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      // Convert to base64
      const reader = new FileReader()
      reader.onload = (event: any) => {
        const base64 = event.target.result
        if (editor) {
          editor.chain().focus().setImage({ src: base64 }).run()
        }
      }
      reader.readAsDataURL(file)
    }
  }



  // Sync editor content when value prop changes externally
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
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap items-center gap-2">
        {/* Font Family */}
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

        {/* Font Size */}
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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Text Style Buttons */}
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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Headings */}
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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Lists */}
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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Blockquote */}
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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Image Upload */}
        <button
          type="button"
          onClick={handleImageUpload}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Insert Image (Upload)"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Bordered Paragraph */}
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

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // All state declarations must be at the top, before any conditional logic
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Templates state
  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [showTemplateUploadModal, setShowTemplateUploadModal] = useState(false)
  const [templateUploading, setTemplateUploading] = useState(false)
  const [showTemplateEditModal, setShowTemplateEditModal] = useState(false)
  const [templateEditing, setTemplateEditing] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [showGalleryUploadModal, setShowGalleryUploadModal] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [showGalleryEditModal, setShowGalleryEditModal] = useState(false)
  const [galleryEditing, setGalleryEditing] = useState(false)
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null)
  const [galleryCurrentPage, setGalleryCurrentPage] = useState(1)
  const [galleryTotalPages, setGalleryTotalPages] = useState(1)
  const [galleryTotalItems, setGalleryTotalItems] = useState(0)

  // Thought Leadership Blogs state
  const [thoughtLeadershipBlogs, setThoughtLeadershipBlogs] = useState<Blog[]>([])
  const [thoughtLeadershipBlogsLoading, setThoughtLeadershipBlogsLoading] = useState(true)
  const [showThoughtLeadershipBlogCreateModal, setShowThoughtLeadershipBlogCreateModal] = useState(false)
  const [thoughtLeadershipBlogCreating, setThoughtLeadershipBlogCreating] = useState(false)
  const [showThoughtLeadershipBlogEditModal, setShowThoughtLeadershipBlogEditModal] = useState(false)
  const [thoughtLeadershipBlogEditing, setThoughtLeadershipBlogEditing] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)

  // Gallery Blogs state
  const [galleryBlogs, setGalleryBlogs] = useState<Blog[]>([])
  const [galleryBlogsLoading, setGalleryBlogsLoading] = useState(true)
  const [showGalleryBlogCreateModal, setShowGalleryBlogCreateModal] = useState(false)
  const [galleryBlogCreating, setGalleryBlogCreating] = useState(false)

  // Thought Leadership Photos state
  const [thoughtLeadershipPhotos, setThoughtLeadershipPhotos] = useState<any[]>([])
  const [thoughtLeadershipPhotosLoading, setThoughtLeadershipPhotosLoading] = useState(true)
  const [showThoughtLeadershipPhotoUploadModal, setShowThoughtLeadershipPhotoUploadModal] = useState(false)
  const [thoughtLeadershipPhotoUploading, setThoughtLeadershipPhotoUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'blog' | 'gallery' | 'gallery-blog' | 'thought-leadership-photo', title: string} | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Template upload form state
  const [templateUploadForm, setTemplateUploadForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Legal Documents',
    image: null as File | null,
    pdfFile: null as File | null,
    customOptions: [] as Array<{
      name: string
      price: string
      description: string
      features: string[]
    }>
  })

  // Template edit form state
  const [templateEditForm, setTemplateEditForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Legal Documents',
    image: null as File | null,
    pdfFile: null as File | null,
    existingImageUrl: '',
    customOptions: [] as Array<{
      name: string
      price: string
      description: string
      features: string[]
    }>
  })

  // Gallery upload form state
  const [galleryUploadForm, setGalleryUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    images: [] as File[]
  })

  // Gallery edit form state
  const [galleryEditForm, setGalleryEditForm] = useState({
    title: '',
    description: '',
    image: null as File | null,
    existingImageData: [] as string[]
  })

  // Thought Leadership Blog create form state
  const [thoughtLeadershipBlogCreateForm, setThoughtLeadershipBlogCreateForm] = useState({
    title: '',
    description: '',
    category: 'ARTICLE' as 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS',
    content: '',
    externalUrl: '',
    image: null as File | null
  })

  // Thought Leadership Blog edit form state
  const [thoughtLeadershipBlogEditForm, setThoughtLeadershipBlogEditForm] = useState({
    title: '',
    description: '',
    category: 'ARTICLE' as 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS',
    content: '',
    externalUrl: '',
    image: null as File | null,
    existingImageUrl: '',
    removeImage: false
  })

  // Gallery Blog create form state
  const [galleryBlogCreateForm, setGalleryBlogCreateForm] = useState({
    title: '',
    description: '',
    category: 'ARTICLE' as 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS' | 'CASE_STUDY' | 'NEWSLETTER' | 'WHITEPAPER',
    content: '',
    externalUrl: '',
    image: null as File | null
  })

  // Thought Leadership Photo upload form state
  const [thoughtLeadershipPhotoUploadForm, setThoughtLeadershipPhotoUploadForm] = useState({
    title: '',
    description: '',
    category: 'General',
    displayOrder: 0,
    image: null as File | null
  })
  
  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }
  
  // Check authentication status
  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (status === 'unauthenticated' || !session) {
      console.log('🔒 No session found, redirecting to login')
      router.push('/admin/login')
      return
    }
    
    if (session.user?.role !== 'admin' && session.user?.role !== 'super-admin') {
      console.log('🔒 Invalid role, redirecting to login')
      router.push('/admin/login')
      return
    }
    
    console.log('✅ Authenticated admin:', session.user)
  }, [session, status, router])

  // Load dashboard data when section changes to dashboard
  useEffect(() => {
    if (activeSection === 'dashboard' && session && status === 'authenticated') {
      fetchTemplates()
      fetchGalleryItems(1, 1000) // Fetch all items for accurate count
      fetchThoughtLeadershipBlogs()
      fetchGalleryBlogs()
      fetchThoughtLeadershipPhotos()
    }
  }, [activeSection, session, status])
  
  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'thought-leadership-blogs', label: 'Thought Leadership', icon: Newspaper },
    { id: 'gallery-blogs', label: 'Gallery Blogs', icon: Newspaper },
    { id: 'thought-leadership-photos', label: 'Thought Leadership Photos', icon: Camera },
  ]

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true)
      console.log('Fetching templates...')
      const response = await fetch('/api/admin/templates')
      console.log('Template response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Template data received:', data)
        setTemplates(data.templates || [])
        console.log('Templates set:', data.templates?.length || 0)
      } else {
        console.error('Template fetch failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  // Fetch gallery items with pagination
  const fetchGalleryItems = async (page: number = 1, limit: number = 10) => {
    try {
      setGalleryLoading(true)
      const response = await fetch(`/api/admin/gallery?page=${page}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data.galleryItems || [])
        setGalleryTotalPages(data.pagination?.pages || 1)
        setGalleryTotalItems(data.pagination?.total || 0)
        setGalleryCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setGalleryLoading(false)
    }
  }

  // Fetch thought leadership blogs
  const fetchThoughtLeadershipBlogs = async () => {
    try {
      setThoughtLeadershipBlogsLoading(true)
      const response = await fetch(`/api/thought-leadership-blogs?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setThoughtLeadershipBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching thought leadership blogs:', error)
    } finally {
      setThoughtLeadershipBlogsLoading(false)
    }
  }

  // Fetch gallery blogs
  const fetchGalleryBlogs = async () => {
    try {
      setGalleryBlogsLoading(true)
      const response = await fetch(`/api/gallery-blogs?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setGalleryBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching gallery blogs:', error)
    } finally {
      setGalleryBlogsLoading(false)
    }
  }

  // Fetch thought leadership photos
  const fetchThoughtLeadershipPhotos = async () => {
    try {
      setThoughtLeadershipPhotosLoading(true)
      const response = await fetch(`/api/admin/thought-leadership-photos?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setThoughtLeadershipPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Error fetching thought leadership photos:', error)
    } finally {
      setThoughtLeadershipPhotosLoading(false)
    }
  }

  // Handle template upload
  const handleTemplateUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateUploadForm.image) {
      alert('Please select a preview image')
      return
    }
    if (!templateUploadForm.pdfFile) {
      alert('Please select a PDF template file')
      return
    }
    if (!templateUploadForm.title) {
      alert('Please fill in the title field')
      return
    }
    if (!templateUploadForm.description) {
      alert('Please fill in the description field')
      return
    }
    if (!templateUploadForm.price) {
      alert('Please fill in the price field')
      return
    }

    setTemplateUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', templateUploadForm.image)
      formData.append('pdfFile', templateUploadForm.pdfFile)
      formData.append('title', templateUploadForm.title)
      formData.append('description', templateUploadForm.description)
      formData.append('price', templateUploadForm.price)
      formData.append('category', templateUploadForm.category)
      formData.append('uploadedBy', session?.user?.id || 'admin')
      
      // Set default contact info automatically (from website defaults)
      const defaultCalendlyLink = 'https://calendly.com/ishita-fathomlegal/free-20-mins-consultation'
      const defaultContactEmail = 'assist@fathomlegal.com'
      
      formData.append('defaultCalendlyLink', defaultCalendlyLink)
      formData.append('defaultContactEmail', defaultContactEmail)

      // Add custom template options if any
      if (templateUploadForm.customOptions.length > 0) {
        formData.append('isCustom', 'true')
        
        // Convert custom options to JSON (use default contact info)
        const customOptionsJson = JSON.stringify(
          templateUploadForm.customOptions.map(opt => ({
            name: opt.name,
            price: parseFloat(opt.price) || 0,
            description: opt.description,
            features: opt.features.filter(f => f.trim() !== ''),
            calendlyLink: defaultCalendlyLink,
            contactEmail: defaultContactEmail
          }))
        )
        formData.append('customOptions', customOptionsJson)
      }

      const response = await fetch('/api/admin/templates/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        console.log('Template upload successful, refreshing templates...')
        setShowTemplateUploadModal(false)
        setTemplateUploadForm({ 
          title: '',
          description: '', 
          price: '', 
          category: 'Legal Documents', 
          image: null, 
          pdfFile: null,
          customOptions: []
        })
        fetchTemplates()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
      } else {
        const errorData = await response.json()
        console.error('Template upload failed:', response.status, response.statusText, errorData.error)
        alert(`Upload failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Template upload error:', error)
      alert('Error uploading template')
    } finally {
      setTemplateUploading(false)
    }
  }

  // Handle gallery upload
  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryUploadForm.images || galleryUploadForm.images.length === 0) {
      alert('Please select at least one image')
      return
    }

    setGalleryUploading(true)
    try {
      const formData = new FormData()
      // Append all images with the same key 'image'
      galleryUploadForm.images.forEach((image) => {
        formData.append('image', image)
      })
      formData.append('title', galleryUploadForm.title)
      formData.append('description', galleryUploadForm.description)
      formData.append('category', galleryUploadForm.category)
      formData.append('uploadedBy', session?.user?.id || 'admin')

      console.log('Uploading gallery images:', {
        imageCount: galleryUploadForm.images.length,
        title: galleryUploadForm.title
      })

      const response = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Upload failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || 'Upload failed'
          console.error('Upload error response:', errorData)
        } catch (parseError) {
          const text = await response.text()
          console.error('Failed to parse error response:', text)
          errorMessage = `Upload failed with status ${response.status}: ${text}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Upload successful:', result)

      setShowGalleryUploadModal(false)
      setGalleryUploadForm({ title: '', description: '', category: '', images: [] })
      fetchGalleryItems(1, 1000)
      // Refresh dashboard counts if on dashboard
      if (activeSection === 'dashboard') {
        fetchTemplates()
        fetchThoughtLeadershipBlogs()
        fetchGalleryBlogs()
        fetchThoughtLeadershipPhotos()
      }
      setSuccessMessage(`Successfully uploaded ${galleryUploadForm.images.length} photo(s)!`)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Gallery upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Upload failed: ${errorMessage}`)
    } finally {
      setGalleryUploading(false)
    }
  }

  // Handle opening gallery edit modal
  const handleGalleryEdit = (item: GalleryItem) => {
    setEditingGalleryId(item._id)
    // Handle both array (new) and string (legacy) imageData
    const existingImages = Array.isArray(item.imageData) ? item.imageData : [item.imageData]
    setGalleryEditForm({
      title: item.title,
      description: item.description || '',
      image: null,
      existingImageData: existingImages
    })
    setShowGalleryEditModal(true)
  }

  // Handle gallery update
  const handleGalleryUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryEditForm.title) {
      alert('Please fill in the photo description')
      return
    }

    if (!editingGalleryId) {
      alert('Gallery item ID is missing')
      return
    }

    setGalleryEditing(true)
    try {
      const formData = new FormData()
      formData.append('id', editingGalleryId)
      formData.append('title', galleryEditForm.title)
      formData.append('description', galleryEditForm.description || '')
      
      if (galleryEditForm.image) {
        formData.append('image', galleryEditForm.image)
      }

      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        setShowGalleryEditModal(false)
        setEditingGalleryId(null)
        setGalleryEditForm({ 
          title: '', 
          description: '', 
          image: null,
          existingImageData: []
        })
        fetchGalleryItems(1, 1000)
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setSuccessMessage('Gallery item updated successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update gallery item')
      }
    } catch (error) {
      console.error('Gallery update error:', error)
      alert('Failed to update gallery item')
    } finally {
      setGalleryEditing(false)
    }
  }

  // Handle blog creation
  const handleThoughtLeadershipBlogCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!thoughtLeadershipBlogCreateForm.title) {
      alert('Please fill in the title field')
      return
    }

    if (!thoughtLeadershipBlogCreateForm.description) {
      alert('Please fill in the description field')
      return
    }

    if (!thoughtLeadershipBlogCreateForm.content && !thoughtLeadershipBlogCreateForm.externalUrl) {
      alert('Please provide either content or external URL')
      return
    }

    setThoughtLeadershipBlogCreating(true)
    try {
      const formData = new FormData()
      formData.append('title', thoughtLeadershipBlogCreateForm.title)
      formData.append('description', thoughtLeadershipBlogCreateForm.description || '')
      formData.append('category', thoughtLeadershipBlogCreateForm.category)
      formData.append('content', thoughtLeadershipBlogCreateForm.content)
      formData.append('externalUrl', thoughtLeadershipBlogCreateForm.externalUrl)
      
      if (thoughtLeadershipBlogCreateForm.image) {
        formData.append('image', thoughtLeadershipBlogCreateForm.image)
      }

      const response = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setShowThoughtLeadershipBlogCreateModal(false)
        setThoughtLeadershipBlogCreateForm({ 
          title: '', 
          description: '', 
          category: 'ARTICLE', 
          content: '', 
          externalUrl: '', 
          image: null
        })
        fetchThoughtLeadershipBlogs()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchGalleryItems(1, 1000)
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setSuccessMessage('Thought Leadership blog created successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Blog creation error:', error)
      alert('Failed to create blog')
    } finally {
      setThoughtLeadershipBlogCreating(false)
    }
  }

  // Handle opening edit modal
  const handleThoughtLeadershipBlogEdit = (blog: Blog) => {
    setEditingBlogId(blog._id)
    setThoughtLeadershipBlogEditForm({
      title: blog.title,
      description: blog.description,
      category: blog.category,
      content: blog.content || '',
      externalUrl: blog.externalUrl || '',
      image: null,
      existingImageUrl: blog.imageUrl || '',
      removeImage: false
    })
    setShowThoughtLeadershipBlogEditModal(true)
  }

  // Handle blog update
  const handleThoughtLeadershipBlogUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!thoughtLeadershipBlogEditForm.title) {
      alert('Please fill in the title field')
      return
    }

    if (!thoughtLeadershipBlogEditForm.description) {
      alert('Please fill in the description field')
      return
    }

    if (!thoughtLeadershipBlogEditForm.content && !thoughtLeadershipBlogEditForm.externalUrl) {
      alert('Please provide either content or external URL')
      return
    }

    if (!editingBlogId) {
      alert('Blog ID is missing')
      return
    }

    setThoughtLeadershipBlogEditing(true)
    try {
      const formData = new FormData()
      formData.append('id', editingBlogId)
      formData.append('title', thoughtLeadershipBlogEditForm.title)
      formData.append('description', thoughtLeadershipBlogEditForm.description || '')
      formData.append('category', thoughtLeadershipBlogEditForm.category)
      formData.append('content', thoughtLeadershipBlogEditForm.content)
      formData.append('externalUrl', thoughtLeadershipBlogEditForm.externalUrl)
      formData.append('removeImage', thoughtLeadershipBlogEditForm.removeImage.toString())
      
      if (thoughtLeadershipBlogEditForm.image) {
        formData.append('image', thoughtLeadershipBlogEditForm.image)
      }

      const response = await fetch('/api/admin/blogs', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        setShowThoughtLeadershipBlogEditModal(false)
        setEditingBlogId(null)
        setThoughtLeadershipBlogEditForm({ 
          title: '', 
          description: '', 
          category: 'ARTICLE', 
          content: '', 
          externalUrl: '', 
          image: null,
          existingImageUrl: '',
          removeImage: false
        })
        fetchThoughtLeadershipBlogs()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchGalleryItems(1, 1000)
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setSuccessMessage('Thought Leadership blog updated successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Blog update error:', error)
      alert('Failed to update blog')
    } finally {
      setThoughtLeadershipBlogEditing(false)
    }
  }

  // Handle gallery blog creation
  const handleGalleryBlogCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!galleryBlogCreateForm.title) {
      alert('Please fill in the title field')
      return
    }

    if (!galleryBlogCreateForm.description) {
      alert('Please fill in the description field')
      return
    }

    if (!galleryBlogCreateForm.content && !galleryBlogCreateForm.externalUrl) {
      alert('Please provide either content or external URL')
      return
    }

    setGalleryBlogCreating(true)
    try {
      const formData = new FormData()
      formData.append('title', galleryBlogCreateForm.title)
      formData.append('description', galleryBlogCreateForm.description || '')
      formData.append('category', galleryBlogCreateForm.category)
      formData.append('content', galleryBlogCreateForm.content)
      formData.append('externalUrl', galleryBlogCreateForm.externalUrl)
      
      if (galleryBlogCreateForm.image) {
        formData.append('image', galleryBlogCreateForm.image)
      }

      const response = await fetch('/api/admin/gallery-blogs/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setShowGalleryBlogCreateModal(false)
        setGalleryBlogCreateForm({ 
          title: '', 
          description: '', 
          category: 'ARTICLE', 
          content: '', 
          externalUrl: '', 
          image: null
        })
        fetchGalleryBlogs()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setSuccessMessage('Gallery blog created successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create gallery blog')
      }
    } catch (error) {
      console.error('Gallery blog creation error:', error)
      alert('Failed to create gallery blog')
    } finally {
      setGalleryBlogCreating(false)
    }
  }

  // Handle thought leadership photo upload
  const handleThoughtLeadershipPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!thoughtLeadershipPhotoUploadForm.title) {
      alert('Please fill in the title field')
      return
    }

    if (!thoughtLeadershipPhotoUploadForm.image) {
      alert('Please select an image')
      return
    }

    setThoughtLeadershipPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', thoughtLeadershipPhotoUploadForm.title)
      formData.append('description', thoughtLeadershipPhotoUploadForm.description)
      formData.append('category', thoughtLeadershipPhotoUploadForm.category)
      formData.append('displayOrder', thoughtLeadershipPhotoUploadForm.displayOrder.toString())
      formData.append('image', thoughtLeadershipPhotoUploadForm.image)

      const response = await fetch('/api/admin/thought-leadership-photos/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setShowThoughtLeadershipPhotoUploadModal(false)
        setThoughtLeadershipPhotoUploadForm({
          title: '',
          description: '',
          category: 'General',
          displayOrder: 0,
          image: null
        })
        fetchThoughtLeadershipPhotos()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
        }
        setSuccessMessage('Thought leadership photo uploaded successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to upload photo')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo')
    } finally {
      setThoughtLeadershipPhotoUploading(false)
    }
  }

  // Handle template deletion
  const handleTemplateEdit = (template: Template) => {
    setEditingTemplateId(template._id)
    setTemplateEditForm({
      title: template.title,
      description: template.description,
      price: template.price.toString(),
      category: template.category,
      image: null,
      pdfFile: null,
      existingImageUrl: template.imageData || template.imageUrl || '',
      customOptions: template.customOptions?.map(opt => ({
        name: opt.name,
        price: opt.price.toString(),
        description: opt.description || '',
        features: opt.features || []
      })) || []
    })
    setShowTemplateEditModal(true)
  }

  const handleTemplateUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplateId) {
      alert('Template ID is missing')
      return
    }

    if (!templateEditForm.title || !templateEditForm.description || !templateEditForm.price) {
      alert('Please fill in all required fields')
      return
    }

    setTemplateEditing(true)
    try {
      const formData = new FormData()
      formData.append('id', editingTemplateId)
      formData.append('title', templateEditForm.title)
      formData.append('description', templateEditForm.description)
      formData.append('price', templateEditForm.price)
      formData.append('category', templateEditForm.category)
      
      if (templateEditForm.image) {
        formData.append('image', templateEditForm.image)
      }
      
      if (templateEditForm.pdfFile) {
        formData.append('pdfFile', templateEditForm.pdfFile)
      }

      // Set default contact info automatically
      const defaultCalendlyLink = 'https://calendly.com/ishita-fathomlegal/free-20-mins-consultation'
      const defaultContactEmail = 'assist@fathomlegal.com'
      
      formData.append('defaultCalendlyLink', defaultCalendlyLink)
      formData.append('defaultContactEmail', defaultContactEmail)

      // Add custom options if any
      if (templateEditForm.customOptions.length > 0) {
        formData.append('isCustom', 'true')
        
        const customOptionsJson = JSON.stringify(
          templateEditForm.customOptions.map(opt => ({
            name: opt.name,
            price: parseFloat(opt.price) || 0,
            description: opt.description,
            features: opt.features.filter(f => f.trim() !== ''),
            calendlyLink: defaultCalendlyLink,
            contactEmail: defaultContactEmail
          }))
        )
        formData.append('customOptions', customOptionsJson)
      }

      const response = await fetch('/api/admin/templates', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        setShowTemplateEditModal(false)
        setEditingTemplateId(null)
        setTemplateEditForm({
          title: '',
          description: '',
          price: '',
          category: 'Legal Documents',
          image: null,
          pdfFile: null,
          existingImageUrl: '',
          customOptions: []
        })
        fetchTemplates()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setSuccessMessage('Template updated successfully!')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update template')
      }
    } catch (error) {
      console.error('Template update error:', error)
      alert('Failed to update template')
    } finally {
      setTemplateEditing(false)
    }
  }

  const handleTemplateDelete = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates?id=${templateId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTemplates()
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
      }
    } catch (error) {
      console.error('Template delete error:', error)
    }
  }

  // Handle gallery item deletion
  const handleGalleryDelete = (itemId: string, itemTitle: string) => {
    setItemToDelete({ id: itemId, type: 'gallery', title: itemTitle })
    setShowDeleteConfirm(true)
  }

  // Handle blog deletion
  const handleBlogDelete = (blogId: string, blogTitle: string) => {
    setItemToDelete({ id: blogId, type: 'blog', title: blogTitle })
    setShowDeleteConfirm(true)
  }

  // Handle gallery blog deletion
  const handleGalleryBlogDelete = (blogId: string, blogTitle: string) => {
    setItemToDelete({ id: blogId, type: 'gallery-blog', title: blogTitle })
    setShowDeleteConfirm(true)
  }

  // Handle thought leadership photo deletion
  const handleThoughtLeadershipPhotoDelete = (photoId: string, photoTitle: string) => {
    setItemToDelete({ id: photoId, type: 'thought-leadership-photo', title: photoTitle })
    setShowDeleteConfirm(true)
  }

  // Execute deletion
  const executeDelete = async () => {
    if (!itemToDelete) return

    setDeleteLoading(true)
    try {
      let endpoint = ''
      if (itemToDelete.type === 'blog') {
        endpoint = '/api/admin/blogs'
      } else if (itemToDelete.type === 'gallery-blog') {
        endpoint = '/api/gallery-blogs'
      } else if (itemToDelete.type === 'thought-leadership-photo') {
        endpoint = '/api/admin/thought-leadership-photos'
      } else {
        endpoint = '/api/admin/gallery'
      }
      
      const response = await fetch(`${endpoint}?id=${itemToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        if (itemToDelete.type === 'blog') {
          fetchThoughtLeadershipBlogs()
        } else if (itemToDelete.type === 'gallery-blog') {
          fetchGalleryBlogs()
        } else if (itemToDelete.type === 'thought-leadership-photo') {
          fetchThoughtLeadershipPhotos()
        } else {
          fetchGalleryItems(1, 1000)
        }
        // Refresh dashboard counts if on dashboard
        if (activeSection === 'dashboard') {
          fetchTemplates()
          fetchGalleryItems(1, 1000)
          fetchThoughtLeadershipBlogs()
          fetchGalleryBlogs()
          fetchThoughtLeadershipPhotos()
        }
        setShowDeleteConfirm(false)
        setItemToDelete(null)
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete item')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Load data when section is selected
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    if (section === 'dashboard') {
      // Fetch all data for dashboard
      fetchTemplates()
      fetchGalleryItems(1, 1000) // Fetch all items for accurate count
      fetchThoughtLeadershipBlogs()
      fetchGalleryBlogs()
      fetchThoughtLeadershipPhotos()
    } else if (section === 'templates') {
      fetchTemplates()
    } else if (section === 'gallery') {
      fetchGalleryItems()
    } else if (section === 'thought-leadership-blogs') {
      fetchThoughtLeadershipBlogs()
    } else if (section === 'gallery-blogs') {
      fetchGalleryBlogs()
    } else if (section === 'thought-leadership-photos') {
      fetchThoughtLeadershipPhotos()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar page="admin" />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      
      {/* Main Layout with Sidebar */}
      <div className="flex min-h-screen pt-20">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
          <div className="p-6 flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h3>
            <div className="border-b border-gray-200 mb-6"></div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* User info and logout */}
          <div className="p-6 border-t border-gray-200">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {activeSection === 'dashboard' && (
              <>
                {/* Dashboard Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                  <p className="text-gray-600">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {/* Card 1 - Templates */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Templates</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{templates.length}</p>
                        <p className="text-sm text-gray-500">Legal documents</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Thought Leadership Blogs */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Thought Leadership</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{thoughtLeadershipBlogs.length}</p>
                        <p className="text-sm text-gray-500">Published articles</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Gallery Blogs */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Gallery Blogs</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{galleryBlogs.length}</p>
                        <p className="text-sm text-gray-500">Gallery articles</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card 4 - Gallery Photos */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Photos</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{galleryItems.length}</p>
                        <p className="text-sm text-gray-500">Gallery images</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card 5 - Active Photos */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Active Photos</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{galleryItems.filter(item => item.isActive).length}</p>
                        <p className="text-sm text-gray-500">Currently visible</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'templates' && (
              <>
                {/* Templates Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Management</h1>
                    <p className="text-gray-600">Upload, manage and delete your legal document templates</p>
                  </div>
                  <button
                    onClick={() => setShowTemplateUploadModal(true)}
                    className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Upload Template
                  </button>
                </div>

                {/* Templates Grid */}
                {templatesLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates uploaded yet</h3>
                    <p className="text-gray-600 mb-6">Start by uploading your first template to the store.</p>
                    <button
                      onClick={() => setShowTemplateUploadModal(true)}
                      className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl mx-auto"
                      style={{ backgroundColor: '#A5292A', color: 'white' }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Upload Template
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((template) => (
                      <div key={template._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          {(template.imageData || template.imageUrl) ? (
                            <img
                              src={template.imageData || template.imageUrl}
                              alt={template.title}
                              className="w-full h-64 object-cover"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                              <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#A5292A', color: 'white' }}>
                              {template.category}
                            </span>
                            <span className="text-xs text-gray-500">{template.downloadCount} downloads</span>
                          </div>
                          
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                            {template.title}
                          </h3>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {template.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">₹{template.price || 0}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleTemplateEdit(template)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleTemplateDelete(template._id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === 'gallery' && (
              <>
                {/* Gallery Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
                    <p className="text-gray-600">Upload, manage and delete your gallery images</p>
                  </div>
                  <button
                    onClick={() => setShowGalleryUploadModal(true)}
                    className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Upload Image
                  </button>
                </div>

                {/* Gallery Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Images</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{galleryItems.length}</p>
                        <p className="text-sm text-gray-500">Gallery images uploaded</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Active Images</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{galleryItems.filter(item => item.isActive).length}</p>
                        <p className="text-sm text-gray-500">Currently visible</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Grid */}
                {galleryLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images</h3>
                      {galleryItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
                      ) : (
                        <div className="space-y-3">
                          {galleryItems.map((item, index) => (
                            <div key={item._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-4">
                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                  {index + 1}
                                </span>
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                  )}
                                  {!item.isActive && (
                                    <span className="inline-block mt-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                      Deleted
                                    </span>
                                  )}
                                </div>
                              </div>
                              {item.isActive && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleGalleryEdit(item)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                  title="Edit image"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleGalleryDelete(item._id, item.title)}
                                  className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                  title="Delete image"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gallery Pagination */}
                    {galleryTotalPages > 1 && (
                      <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => fetchGalleryItems(galleryCurrentPage - 1)}
                            disabled={galleryCurrentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          {/* Page Numbers */}
                          {Array.from({ length: Math.min(5, galleryTotalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <button
                                key={page}
                                onClick={() => fetchGalleryItems(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                  galleryCurrentPage === page
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}

                          {/* Next Button */}
                          <button
                            onClick={() => fetchGalleryItems(galleryCurrentPage + 1)}
                            disabled={galleryCurrentPage === galleryTotalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}

                    {/* Gallery Page Info */}
                    {galleryTotalItems > 0 && (
                      <div className="mt-4 text-center text-sm text-gray-600">
                        Showing page {galleryCurrentPage} of {galleryTotalPages} ({galleryTotalItems} total images)
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeSection === 'thought-leadership-blogs' && (
              <>
                {/* Thought Leadership Blogs Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thought Leadership Management</h1>
                    <p className="text-gray-600">Create, manage and delete your thought leadership articles</p>
                  </div>
                  <button
                    onClick={() => setShowThoughtLeadershipBlogCreateModal(true)}
                    className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Article
                  </button>
                </div>

                {/* Thought Leadership Blogs Grid */}
                {thoughtLeadershipBlogsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
                  </div>
                ) : thoughtLeadershipBlogs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                      <Newspaper className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No thought leadership articles yet</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first thought leadership article.</p>
                    <button
                      onClick={() => setShowThoughtLeadershipBlogCreateModal(true)}
                      className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl mx-auto"
                      style={{ backgroundColor: '#A5292A', color: 'white' }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Article
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {thoughtLeadershipBlogs.map((blog) => (
                      <div key={blog._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                        {/* Category Badge */}
                        <div className="p-4 pb-0">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {blog.category}
                          </span>
                        </div>

                        {/* Logo/Image */}
                        <div className="px-4 pb-4">
                          {blog.logoUrl ? (
                            <div className="mb-4">
                              <img
                                src={blog.logoUrl}
                                alt={`${blog.category} Logo`}
                                className="h-12 object-contain"
                              />
                            </div>
                          ) : blog.imageUrl ? (
                            <div className="mb-4">
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Newspaper className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="px-4 pb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {blog.description}
                          </p>

                          {/* External Link Indicator */}
                          {blog.externalUrl && (
                            <div className="mb-4 flex items-center text-red-600 text-sm font-medium">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              <span>External Link</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleThoughtLeadershipBlogEdit(blog)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleBlogDelete(blog._id, blog.title)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === 'gallery-blogs' && (
              <>
                {/* Gallery Blogs Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Blogs Management</h1>
                    <p className="text-gray-600">Create, manage and delete your gallery blog articles</p>
                  </div>
                  <button
                    onClick={() => setShowGalleryBlogCreateModal(true)}
                    className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Gallery Blog
                  </button>
                </div>

                {/* Gallery Blogs Grid */}
                {galleryBlogsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
                  </div>
                ) : galleryBlogs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                      <Newspaper className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No gallery blog articles yet</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first gallery blog article.</p>
                    <button
                      onClick={() => setShowGalleryBlogCreateModal(true)}
                      className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl mx-auto"
                      style={{ backgroundColor: '#A5292A', color: 'white' }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Gallery Blog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryBlogs.map((blog) => (
                      <div key={blog._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                        {/* Category Badge */}
                        <div className="p-4 pb-0">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {blog.category}
                          </span>
                        </div>

                        {/* Logo/Image */}
                        <div className="px-4 pb-4">
                          {blog.logoUrl ? (
                            <div className="mb-4">
                              <img
                                src={blog.logoUrl}
                                alt={`${blog.category} Logo`}
                                className="h-12 object-contain"
                              />
                            </div>
                          ) : blog.imageUrl ? (
                            <div className="mb-4">
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Newspaper className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="px-4 pb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {blog.description}
                          </p>

                          {/* External Link Indicator */}
                          {blog.externalUrl && (
                            <div className="mb-4 flex items-center text-red-600 text-sm font-medium">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              <span>External Link</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleGalleryBlogDelete(blog._id, blog.title)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Thought Leadership Photos Section */}
            {activeSection === 'thought-leadership-photos' && (
              <>
                {/* Thought Leadership Photos Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thought Leadership Photos Management</h1>
                    <p className="text-gray-600">Upload, manage and delete photos for the thought leadership page</p>
                  </div>
                  <button
                    onClick={() => setShowThoughtLeadershipPhotoUploadModal(true)}
                    className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Upload Photo
                  </button>
                </div>

                {/* Thought Leadership Photos Grid */}
                {thoughtLeadershipPhotosLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
                  </div>
                ) : thoughtLeadershipPhotos.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                      <Camera className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
                    <p className="text-gray-600 mb-6">Start by uploading your first thought leadership photo.</p>
                    <button
                      onClick={() => setShowThoughtLeadershipPhotoUploadModal(true)}
                      className="flex items-center px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl mx-auto"
                      style={{ backgroundColor: '#A5292A', color: 'white' }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Upload Photo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {thoughtLeadershipPhotos.map((photo) => (
                      <div key={photo._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                        {/* Image */}
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {photo.title}
                          </h3>
                          
                          {photo.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {photo.description}
                            </p>
                          )}

                          {photo.category && (
                            <div className="mb-3">
                              <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                {photo.category}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleThoughtLeadershipPhotoDelete(photo._id, photo.title)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Order: {photo.displayOrder || 0}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Created: {new Date(photo.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      {/* Gallery Blog Create Modal */}
      {showGalleryBlogCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Gallery Blog Post</h2>
              <button
                onClick={() => setShowGalleryBlogCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGalleryBlogCreate} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={galleryBlogCreateForm.title}
                  onChange={(e) => setGalleryBlogCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={galleryBlogCreateForm.description}
                  onChange={(e) => setGalleryBlogCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  rows={3}
                  placeholder="Enter blog description"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={galleryBlogCreateForm.category}
                  onChange={(e) => setGalleryBlogCreateForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  required
                >
                  <option value="ARTICLE">Article</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="FEATURE">Feature</option>
                  <option value="NEWS">News</option>
                  <option value="CASE_STUDY">Case Study</option>
                  <option value="NEWSLETTER">Newsletter</option>
                  <option value="WHITEPAPER">Whitepaper</option>
                </select>
              </div>

              {/* Content and External URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content
                  </label>
                  <RichTextEditor
                    value={galleryBlogCreateForm.content}
                    onChange={(value) => setGalleryBlogCreateForm(prev => ({ ...prev, content: value }))}
                    placeholder="Enter blog content (optional if external URL is provided)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL
                  </label>
                  <input
                    type="url"
                    value={galleryBlogCreateForm.externalUrl}
                    onChange={(e) => setGalleryBlogCreateForm(prev => ({ ...prev, externalUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-black"
                    placeholder="https://example.com/blog-post (optional if content is provided)"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryBlogCreateForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGalleryBlogCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={galleryBlogCreating}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {galleryBlogCreating ? 'Creating...' : 'Create Gallery Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Upload Modal */}
      {showTemplateUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload Template</h2>
              <button
                onClick={() => setShowTemplateUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleTemplateUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={templateUploadForm.title}
                  onChange={(e) => setTemplateUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="Template title (e.g., Mutual Non-Disclosure Agreement)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={templateUploadForm.description}
                  onChange={(e) => setTemplateUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  onPaste={(e) => {
                    e.preventDefault()
                    const htmlText = e.clipboardData.getData('text/html')
                    const plainText = e.clipboardData.getData('text/plain')
                    let processedText = ''
                    
                    if (htmlText) {
                      // Create a temporary div to parse HTML
                      const tempDiv = document.createElement('div')
                      tempDiv.innerHTML = htmlText
                      
                      // Process the HTML to preserve formatting
                      const processNode = (node: Node): string => {
                        if (node.nodeType === Node.TEXT_NODE) {
                          return node.textContent || ''
                        }
                        
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node as HTMLElement
                          const tagName = element.tagName.toLowerCase()
                          let content = ''
                          
                          // Process child nodes
                          for (let i = 0; i < node.childNodes.length; i++) {
                            content += processNode(node.childNodes[i])
                          }
                          
                          // Handle different HTML elements
                          switch (tagName) {
                            case 'p':
                              return content.trim() + '\n\n'
                            case 'br':
                              return '\n'
                            case 'li':
                              // Preserve bullet point with proper spacing
                              return '• ' + content.trim() + '\n'
                            case 'ul':
                            case 'ol':
                              return content
                            case 'strong':
                            case 'b':
                              // Preserve bold markers
                              return '**' + content + '**'
                            case 'em':
                            case 'i':
                              return '*' + content + '*'
                            default:
                              return content
                          }
                        }
                        
                        return ''
                      }
                      
                      // Process all nodes
                      processedText = Array.from(tempDiv.childNodes)
                        .map(node => processNode(node))
                        .join('')
                        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
                        .trim()
                      
                      // If we got empty result, fall back to plain text
                      if (!processedText) {
                        processedText = plainText
                      }
                    } else {
                      // No HTML, use plain text but preserve bullets
                      processedText = plainText
                        .replace(/[•◦▪▫‣⁃]\s*/g, '• ')
                        .replace(/[-*]\s+/g, '• ')
                    }
                    
                    // Normalize line endings
                    processedText = processedText
                      .replace(/\r\n/g, '\n')
                      .replace(/\r/g, '\n')
                    
                    // Insert the processed text at cursor position
                    const textarea = e.currentTarget
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const currentValue = templateUploadForm.description
                    const newValue = currentValue.substring(0, start) + processedText + currentValue.substring(end)
                    
                    setTemplateUploadForm(prev => ({ ...prev, description: newValue }))
                    
                    // Set cursor position after pasted text
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + processedText.length
                      textarea.focus()
                    }, 0)
                  }}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900 whitespace-pre-wrap"
                  rows={4}
                  placeholder="Template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={templateUploadForm.price}
                  onChange={(e) => setTemplateUploadForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={templateUploadForm.category}
                  onChange={(e) => setTemplateUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                >
                  <option value="Legal Documents">Legal Documents</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Agreements">Agreements</option>
                  <option value="Forms">Forms</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Preview Image *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setTemplateUploadForm(prev => ({ ...prev, image: file }))
                    }
                  }}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a preview image for your template (Max 5MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template File *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setTemplateUploadForm(prev => ({ ...prev, pdfFile: file }))
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload the template file (Any file type, Max 50MB). This file will be hidden from buyers until purchase.
                </p>
              </div>

              {/* Custom Template Options Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Template Options (Optional)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateUploadForm(prev => ({
                        ...prev,
                        customOptions: [...prev.customOptions, {
                          name: '',
                          price: '',
                          description: '',
                          features: [],
                        }]
                      }))
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Add custom template variants. Users will see these options when adding to cart. First column will always be "Normal" (downloadable).
                </p>


                {/* Custom Options List */}
                {templateUploadForm.customOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Option {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateUploadForm(prev => ({
                            ...prev,
                            customOptions: prev.customOptions.filter((_, i) => i !== index)
                          }))
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...templateUploadForm.customOptions]
                            newOptions[index].name = e.target.value
                            setTemplateUploadForm(prev => ({ ...prev, customOptions: newOptions }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                          placeholder="e.g., Basic Custom, Premium Custom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={option.price}
                          onChange={(e) => {
                            const newOptions = [...templateUploadForm.customOptions]
                            newOptions[index].price = e.target.value
                            setTemplateUploadForm(prev => ({ ...prev, customOptions: newOptions }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={option.description}
                        onChange={(e) => {
                          const newOptions = [...templateUploadForm.customOptions]
                          newOptions[index].description = e.target.value
                          setTemplateUploadForm(prev => ({ ...prev, customOptions: newOptions }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        rows={2}
                        placeholder="Brief description of this option"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (one per line) *
                      </label>
                      <textarea
                        required
                        value={option.features.join('\n')}
                        onChange={(e) => {
                          const newOptions = [...templateUploadForm.customOptions]
                          newOptions[index].features = e.target.value.split('\n').filter(f => f.trim())
                          setTemplateUploadForm(prev => ({ ...prev, customOptions: newOptions }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    </div>
                  </div>
                ))}

                {templateUploadForm.customOptions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No custom options added. Click "+ Add Option" to create custom template variants.
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTemplateUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={templateUploading}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    {templateUploading ? 'Uploading...' : 'Upload'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Edit Modal */}
      {showTemplateEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Template</h2>
              <button
                onClick={() => {
                  setShowTemplateEditModal(false)
                  setEditingTemplateId(null)
                  setTemplateEditForm({
                    title: '',
                    description: '',
                    price: '',
                    category: 'Legal Documents',
                    image: null,
                    pdfFile: null,
                    existingImageUrl: '',
                    customOptions: []
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleTemplateUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={templateEditForm.title}
                  onChange={(e) => setTemplateEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="Template title (e.g., Mutual Non-Disclosure Agreement)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={templateEditForm.description}
                  onChange={(e) => setTemplateEditForm(prev => ({ ...prev, description: e.target.value }))}
                  onPaste={(e) => {
                    e.preventDefault()
                    const htmlText = e.clipboardData.getData('text/html')
                    const plainText = e.clipboardData.getData('text/plain')
                    let processedText = ''
                    
                    if (htmlText) {
                      const tempDiv = document.createElement('div')
                      tempDiv.innerHTML = htmlText
                      
                      const processNode = (node: Node): string => {
                        if (node.nodeType === Node.TEXT_NODE) {
                          return node.textContent || ''
                        }
                        
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node as HTMLElement
                          const tagName = element.tagName.toLowerCase()
                          let content = ''
                          
                          for (let i = 0; i < node.childNodes.length; i++) {
                            content += processNode(node.childNodes[i])
                          }
                          
                          switch (tagName) {
                            case 'p':
                              return content.trim() + '\n\n'
                            case 'br':
                              return '\n'
                            case 'li':
                              return '• ' + content.trim() + '\n'
                            case 'ul':
                            case 'ol':
                              return content
                            case 'strong':
                            case 'b':
                              return '**' + content + '**'
                            case 'em':
                            case 'i':
                              return '*' + content + '*'
                            default:
                              return content
                          }
                        }
                        
                        return ''
                      }
                      
                      processedText = Array.from(tempDiv.childNodes)
                        .map(node => processNode(node))
                        .join('')
                        .replace(/\n{3,}/g, '\n\n')
                        .trim()
                      
                      if (!processedText) {
                        processedText = plainText
                      }
                    } else {
                      processedText = plainText
                        .replace(/[•◦▪▫‣⁃]\s*/g, '• ')
                        .replace(/[-*]\s+/g, '• ')
                    }
                    
                    processedText = processedText
                      .replace(/\r\n/g, '\n')
                      .replace(/\r/g, '\n')
                    
                    const textarea = e.currentTarget
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const currentValue = templateEditForm.description
                    const newValue = currentValue.substring(0, start) + processedText + currentValue.substring(end)
                    
                    setTemplateEditForm(prev => ({ ...prev, description: newValue }))
                    
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + processedText.length
                      textarea.focus()
                    }, 0)
                  }}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900 whitespace-pre-wrap"
                  rows={4}
                  placeholder="Template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={templateEditForm.price}
                  onChange={(e) => setTemplateEditForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={templateEditForm.category}
                  onChange={(e) => setTemplateEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                >
                  <option value="Legal Documents">Legal Documents</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Agreements">Agreements</option>
                  <option value="Forms">Forms</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Preview Image
                </label>
                {templateEditForm.existingImageUrl && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img
                      src={templateEditForm.existingImageUrl}
                      alt="Current preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setTemplateEditForm(prev => ({ ...prev, image: file }))
                    }
                  }}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {templateEditForm.existingImageUrl ? 'Leave empty to keep current image' : 'Upload a preview image for your template (Max 5MB)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template File
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setTemplateEditForm(prev => ({ ...prev, pdfFile: file }))
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current file. Upload a new template file (Any file type, Max 50MB).
                </p>
              </div>

              {/* Custom Template Options Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Template Options (Optional)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateEditForm(prev => ({
                        ...prev,
                        customOptions: [...prev.customOptions, {
                          name: '',
                          price: '',
                          description: '',
                          features: [],
                        }]
                      }))
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Add custom template variants. Users will see these options when adding to cart. First column will always be "Normal" (downloadable).
                </p>

                {/* Custom Options List */}
                {templateEditForm.customOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Option {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateEditForm(prev => ({
                            ...prev,
                            customOptions: prev.customOptions.filter((_, i) => i !== index)
                          }))
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...templateEditForm.customOptions]
                            newOptions[index].name = e.target.value
                            setTemplateEditForm(prev => ({ ...prev, customOptions: newOptions }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                          placeholder="e.g., Basic Custom, Premium Custom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={option.price}
                          onChange={(e) => {
                            const newOptions = [...templateEditForm.customOptions]
                            newOptions[index].price = e.target.value
                            setTemplateEditForm(prev => ({ ...prev, customOptions: newOptions }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={option.description}
                        onChange={(e) => {
                          const newOptions = [...templateEditForm.customOptions]
                          newOptions[index].description = e.target.value
                          setTemplateEditForm(prev => ({ ...prev, customOptions: newOptions }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        rows={2}
                        placeholder="Brief description of this option"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (one per line) *
                      </label>
                      <textarea
                        required
                        value={option.features.join('\n')}
                        onChange={(e) => {
                          const newOptions = [...templateEditForm.customOptions]
                          newOptions[index].features = e.target.value.split('\n').filter(f => f.trim())
                          setTemplateEditForm(prev => ({ ...prev, customOptions: newOptions }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
                    </div>
                  </div>
                ))}

                {templateEditForm.customOptions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No custom options added. Click "+ Add Option" to create custom template variants.
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateEditModal(false)
                      setEditingTemplateId(null)
                      setTemplateEditForm({
                        title: '',
                        description: '',
                        price: '',
                        category: 'Legal Documents',
                        image: null,
                        pdfFile: null,
                        existingImageUrl: '',
                        customOptions: []
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={templateEditing}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#A5292A', color: 'white' }}
                  >
                    {templateEditing ? 'Updating...' : 'Update Template'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Upload Modal */}
      {showGalleryUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload Gallery Image</h2>
              <button
                onClick={() => setShowGalleryUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGalleryUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Description *
                </label>
                <input
                  type="text"
                  required
                  value={galleryUploadForm.title}
                  onChange={(e) => setGalleryUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="One line description of the photo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Article (Optional)
                </label>
                <textarea
                  value={galleryUploadForm.description}
                  onChange={(e) => setGalleryUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  rows={4}
                  placeholder="Write a short article about this photo (optional)"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images * (Select multiple - all will share the same title & description)
                </label>
                <input
                  type="file"
                  required
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 0) {
                      setGalleryUploadForm(prev => ({ ...prev, images: files }))
                    }
                  }}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                {galleryUploadForm.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {galleryUploadForm.images.length} file(s) selected - all will be uploaded together:
                    </p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {galleryUploadForm.images.map((file, index) => (
                          <li key={index} className="truncate">
                            • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGalleryUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={galleryUploading}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#A5292A', color: 'white' }}
                >
                  {galleryUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Edit Modal */}
      {showGalleryEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Gallery Image</h2>
              <button
                onClick={() => {
                  setShowGalleryEditModal(false)
                  setEditingGalleryId(null)
                  setGalleryEditForm({ title: '', description: '', image: null, existingImageData: [] })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGalleryUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Description *
                </label>
                <input
                  type="text"
                  required
                  value={galleryEditForm.title}
                  onChange={(e) => setGalleryEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="One line description of the photo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Article (Optional)
                </label>
                <textarea
                  value={galleryEditForm.description}
                  onChange={(e) => setGalleryEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  rows={4}
                  placeholder="Write a short article about this photo (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Images ({galleryEditForm.existingImageData.length})
                </label>
                {galleryEditForm.existingImageData.length > 0 && (
                  <div className="mb-2 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {galleryEditForm.existingImageData.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={img} 
                          alt={`Image ${index + 1}`} 
                          className="w-full h-32 object-cover border border-gray-200 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add More Images (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setGalleryEditForm(prev => ({ ...prev, image: file }))
                    }
                  }}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 file:bg-white file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:text-gray-700 file:text-sm file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select an image to add to the existing photos
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGalleryEditModal(false)
                    setEditingGalleryId(null)
                    setGalleryEditForm({ title: '', description: '', image: null, existingImageData: [] })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={galleryEditing}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#A5292A', color: 'white' }}
                >
                  {galleryEditing ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thought Leadership Blog Create Modal */}
      {showThoughtLeadershipBlogCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Blog Post</h2>
              <button
                onClick={() => setShowThoughtLeadershipBlogCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleThoughtLeadershipBlogCreate} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={thoughtLeadershipBlogCreateForm.title}
                  onChange={(e) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={thoughtLeadershipBlogCreateForm.description}
                  onChange={(e) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  rows={3}
                  placeholder="Enter blog description"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={thoughtLeadershipBlogCreateForm.category}
                  onChange={(e) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  required
                >
                  <option value="ARTICLE">Article</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="FEATURE">Feature</option>
                  <option value="NEWS">News</option>
                </select>
              </div>

              {/* Content or External URL */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content
                  </label>
                  <RichTextEditor
                    value={thoughtLeadershipBlogCreateForm.content}
                    onChange={(value) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, content: value }))}
                    placeholder="Enter blog content (optional if external URL is provided)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL
                  </label>
                  <input
                    type="url"
                    value={thoughtLeadershipBlogCreateForm.externalUrl}
                    onChange={(e) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, externalUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-black"
                    placeholder="https://example.com/blog-post (optional if content is provided)"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThoughtLeadershipBlogCreateForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowThoughtLeadershipBlogCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={thoughtLeadershipBlogCreating}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {thoughtLeadershipBlogCreating ? 'Creating...' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thought Leadership Blog Edit Modal */}
      {showThoughtLeadershipBlogEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Blog Post</h2>
              <button
                onClick={() => {
                  setShowThoughtLeadershipBlogEditModal(false)
                  setEditingBlogId(null)
                  setThoughtLeadershipBlogEditForm({ 
                    title: '', 
                    description: '', 
                    category: 'ARTICLE', 
                    content: '', 
                    externalUrl: '', 
                    image: null,
                    existingImageUrl: '',
                    removeImage: false
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleThoughtLeadershipBlogUpdate} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={thoughtLeadershipBlogEditForm.title}
                  onChange={(e) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={thoughtLeadershipBlogEditForm.description}
                  onChange={(e) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  rows={3}
                  placeholder="Enter blog description"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <select
                  value={thoughtLeadershipBlogEditForm.category}
                  onChange={(e) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black"
                  required
                >
                  <option value="WEBINAR">Webinar</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="FEATURE">Feature</option>
                  <option value="ARTICLE">Article</option>
                  <option value="NEWS">News</option>
                </select>
              </div>

              {/* Content or External URL */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content
                  </label>
                  <RichTextEditor
                    value={thoughtLeadershipBlogEditForm.content}
                    onChange={(value) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, content: value }))}
                    placeholder="Enter blog content (optional if external URL is provided)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL
                  </label>
                  <input
                    type="url"
                    value={thoughtLeadershipBlogEditForm.externalUrl}
                    onChange={(e) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, externalUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-black"
                    placeholder="https://example.com/blog-post (optional if content is provided)"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                {thoughtLeadershipBlogEditForm.existingImageUrl && !thoughtLeadershipBlogEditForm.removeImage && (
                  <div className="mb-3">
                    <img 
                      src={thoughtLeadershipBlogEditForm.existingImageUrl} 
                      alt="Current featured image" 
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, removeImage: true }))}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                {(!thoughtLeadershipBlogEditForm.existingImageUrl || thoughtLeadershipBlogEditForm.removeImage) && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThoughtLeadershipBlogEditForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-black"
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowThoughtLeadershipBlogEditModal(false)
                    setEditingBlogId(null)
                    setThoughtLeadershipBlogEditForm({ 
                      title: '', 
                      description: '', 
                      category: 'ARTICLE', 
                      content: '', 
                      externalUrl: '', 
                      image: null,
                      existingImageUrl: '',
                      removeImage: false
                    })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={thoughtLeadershipBlogEditing}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {thoughtLeadershipBlogEditing ? 'Updating...' : 'Update Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setItemToDelete(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this {itemToDelete.type}?
              </p>
              <p className="text-sm text-gray-600 font-medium">
                "{itemToDelete.title}"
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setItemToDelete(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="ml-2 text-green-200 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Thought Leadership Photo Upload Modal */}
      {showThoughtLeadershipPhotoUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload Thought Leadership Photo</h2>
              <button
                onClick={() => setShowThoughtLeadershipPhotoUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleThoughtLeadershipPhotoUpload} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={thoughtLeadershipPhotoUploadForm.title}
                  onChange={(e) => setThoughtLeadershipPhotoUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="Photo title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={thoughtLeadershipPhotoUploadForm.description}
                  onChange={(e) => setThoughtLeadershipPhotoUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  rows={3}
                  placeholder="Photo description (optional)"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={thoughtLeadershipPhotoUploadForm.category}
                  onChange={(e) => setThoughtLeadershipPhotoUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                >
                  <option value="General">General</option>
                  <option value="Team">Team</option>
                  <option value="Events">Events</option>
                  <option value="Achievements">Achievements</option>
                  <option value="Office">Office</option>
                  <option value="Awards">Awards</option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={thoughtLeadershipPhotoUploadForm.displayOrder}
                  onChange={(e) => setThoughtLeadershipPhotoUploadForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setThoughtLeadershipPhotoUploadForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-black bg-white text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported formats: JPEG, PNG, GIF, WebP</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowThoughtLeadershipPhotoUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={thoughtLeadershipPhotoUploading}
                  className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#A5292A' }}
                >
                  {thoughtLeadershipPhotoUploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}