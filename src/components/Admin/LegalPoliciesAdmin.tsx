'use client'

import { useCallback, useEffect, useState } from 'react'
import { Edit, ExternalLink, Plus, Scale, X } from 'lucide-react'
import RichTextEditor from '@/components/Admin/RichTextEditor'
import { generateSlug } from '@/lib/slug'

type PolicyRecord = {
  slug: string
  title: string
  heroTitle: string
  navbarPage: string
  path: string
  content: string
  updatedAt: string
  isBuiltin?: boolean
}

const emptyPolicy = (): PolicyRecord => ({
  slug: '',
  title: '',
  heroTitle: '',
  navbarPage: 'policy',
  path: '',
  content: '<p></p>',
  updatedAt: new Date().toISOString(),
})

export default function LegalPoliciesAdmin() {
  const [policies, setPolicies] = useState<PolicyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<PolicyRecord | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const fetchPolicies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/legal-policies')
      if (!response.ok) {
        throw new Error('Failed to load legal policies')
      }
      const data = await response.json()
      setPolicies(data.policies ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load legal policies')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  const openEditor = (policy: PolicyRecord) => {
    setSaveMessage(null)
    setIsCreating(false)
    setSlugTouched(true)
    setEditing({ ...policy })
  }

  const openCreate = () => {
    setSaveMessage(null)
    setIsCreating(true)
    setSlugTouched(false)
    setEditing(emptyPolicy())
  }

  const closeEditor = () => {
    if (!saving) {
      setEditing(null)
      setIsCreating(false)
      setSlugTouched(false)
    }
  }

  const updateEditing = (patch: Partial<PolicyRecord>) => {
    setEditing((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (isCreating && !slugTouched && patch.title !== undefined) {
        const slug = generateSlug(patch.title)
        next.slug = slug
        next.path = slug ? `/policies/${slug}` : ''
      }
      if (isCreating && patch.slug !== undefined) {
        next.path = patch.slug ? `/policies/${patch.slug}` : ''
      }
      if (isCreating && patch.heroTitle === undefined && patch.title !== undefined && !prev.heroTitle) {
        next.heroTitle = patch.title
      }
      return next
    })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setSaveMessage(null)
    try {
      const response = await fetch(
        isCreating ? '/api/admin/legal-policies' : `/api/admin/legal-policies/${editing.slug}`,
        {
          method: isCreating ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: editing.slug,
            title: editing.title,
            heroTitle: editing.heroTitle,
            content: editing.content,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save policy')
      }

      if (isCreating) {
        setPolicies((prev) => [...prev, data.policy].sort((a, b) => a.slug.localeCompare(b.slug)))
        setSaveMessage('Policy created successfully.')
      } else {
        setPolicies((prev) =>
          prev.map((p) => (p.slug === editing.slug ? data.policy : p))
        )
        setSaveMessage('Policy saved successfully.')
      }
      setEditing(null)
      setIsCreating(false)
      setSlugTouched(false)
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save policy')
    } finally {
      setSaving(false)
    }
  }

  const canSave =
    editing &&
    editing.title.trim() &&
    editing.heroTitle.trim() &&
    editing.slug.trim() &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(editing.slug)

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="text-red-600" size={24} />
            Legal Policies
          </h2>
          <p className="text-gray-600 mt-2">
            Create and edit legal policy pages shown on the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 self-start"
        >
          <Plus size={16} />
          New policy
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <div
              key={policy.slug}
              className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{policy.path}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(policy.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={policy.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink size={16} />
                  View
                </a>
                <button
                  type="button"
                  onClick={() => openEditor(policy)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {saveMessage && !editing && (
        <p
          className={`mt-4 text-sm ${
            saveMessage.includes('success') ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {saveMessage}
        </p>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {isCreating ? 'New policy' : `Edit ${editing.title}`}
              </h3>
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => updateEditing({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero heading</label>
                <input
                  type="text"
                  value={editing.heroTitle}
                  onChange={(e) => updateEditing({ heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              {isCreating ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL slug</label>
                  <input
                    type="text"
                    value={editing.slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      updateEditing({ slug: generateSlug(e.target.value) })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. cookie-policy"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Public URL: {editing.path || '/policies/your-slug'}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Public URL</label>
                  <p className="text-sm text-gray-600">{editing.path}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <RichTextEditor
                  value={editing.content}
                  onChange={(html) => updateEditing({ content: html })}
                />
              </div>
              {saveMessage && (
                <p
                  className={`text-sm ${
                    saveMessage.includes('success') ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {saveMessage}
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !canSave}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : isCreating ? 'Create policy' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
