'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Building2, Zap, Coins, FileText, Gavel, Lightbulb, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react'
import { Navbar } from '@/components/Navbar/index'
import Footer from '@/components/Footer'

interface FormData {
  selectedServices: string[]
  customNeeds: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  heardAbout: string
  matterDescription: string
}

interface SchedulingData {
  selectedDate: string
  selectedTime: string
  confirmedEmail: string
  googleMeetLink: string
}

export default function ClientIntakePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId, setSessionId] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    selectedServices: [],
    customNeeds: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    heardAbout: '',
    matterDescription: ''
  })
  const [schedulingData, setSchedulingData] = useState<SchedulingData>({
    selectedDate: '',
    selectedTime: '',
    confirmedEmail: '',
    googleMeetLink: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Available time slots for scheduling
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ]

  // Get next 5 working days (excluding weekends)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    let current = new Date(today)
    
    while (dates.length < 5) {
      current.setDate(current.getDate() + 1)
      const dayOfWeek = current.getDay()
      
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(current))
      }
    }
    
    return dates
  }

  const availableDates = getAvailableDates()

  // Initialize session
  useEffect(() => {
    const storedSessionId = localStorage.getItem('intakeSessionId')
    if (storedSessionId) {
      setSessionId(storedSessionId)
      loadFormData(storedSessionId)
    } else {
      const newSessionId = `intake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('intakeSessionId', newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  const loadFormData = async (id: string) => {
    try {
      const response = await fetch(`/api/intake/step1?sessionId=${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          // Merge with defaults to ensure all fields exist
          setFormData({
            selectedServices: data.selectedServices || [],
            customNeeds: data.customNeeds || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || '',
            heardAbout: data.heardAbout || '',
            matterDescription: data.matterDescription || ''
          })
          setCurrentStep(data.currentStep || 1)
        }
      }
    } catch (err) {
      console.error('Error loading form data:', err)
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service]
    }))
  }

  const handleStep1Continue = async () => {
    if (formData.selectedServices.length === 0) {
      setError('Please select at least one service')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/intake/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          selectedServices: formData.selectedServices,
          customNeeds: formData.customNeeds,
          currentStep: 2
        })
      })

      if (response.ok) {
        setCurrentStep(2)
      } else {
        setError('Failed to save selections. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Continue = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/intake/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          heardAbout: formData.heardAbout,
          matterDescription: formData.matterDescription,
          currentStep: 3
        })
      })

      if (response.ok) {
        setCurrentStep(3)
      } else {
        setError('Failed to save details. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateGoogleMeetLink = () => {
    // Generate a unique Google Meet link based on session and date/time
    const meetingCode = `${sessionId.substring(0, 8)}-${Date.now().toString(36)}`
    return `https://meet.google.com/${meetingCode}`
  }

  const handleStep3Continue = async () => {
    if (!schedulingData.confirmedEmail) {
      setError('Please confirm your email address')
      return
    }
    
    // If user hasn't filled date/time (using Calendly), use placeholder values
    // The actual booking is done through Calendly's system
    const selectedDate = schedulingData.selectedDate || new Date().toISOString().split('T')[0]
    const selectedTime = schedulingData.selectedTime || 'To be confirmed via Calendly'

    setError('')
    setIsLoading(true)

    try {
      // Generate Google Meet link
      const googleMeetLink = generateGoogleMeetLink()
      const updatedSchedulingData = { ...schedulingData, googleMeetLink, selectedDate, selectedTime }

      // Save to database
      const dbResponse = await fetch('/api/intake/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          selectedDate,
          selectedTime,
          confirmedEmail: schedulingData.confirmedEmail,
          googleMeetLink,
          currentStep: 4
        })
      })

      if (!dbResponse.ok) {
        setError('Failed to save scheduling. Please try again.')
        setIsLoading(false)
        return
      }

      // Send confirmation email via Gmail
      const emailResponse = await fetch('/api/intake/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: schedulingData.confirmedEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          selectedDate,
          selectedTime,
          matter: formData.selectedServices.join(', '),
          googleMeetLink,
          sessionId
        })
      })

      if (emailResponse.ok) {
        setSuccessMessage('Confirmation email sent successfully!')
        setSchedulingData(updatedSchedulingData)
        setCurrentStep(4)
      } else {
        // Even if email fails, meeting is scheduled. Move to confirmation.
        setSchedulingData(updatedSchedulingData)
        setCurrentStep(4)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartNew = () => {
    localStorage.removeItem('intakeSessionId')
    const newSessionId = `intake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('intakeSessionId', newSessionId)
    setSessionId(newSessionId)
    setCurrentStep(1)
    setFormData({
      selectedServices: [],
      customNeeds: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      heardAbout: '',
      matterDescription: ''
    })
    setSchedulingData({
      selectedDate: '',
      selectedTime: '',
      confirmedEmail: '',
      googleMeetLink: ''
    })
    setError('')
    setSuccessMessage('')
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-colors ${
              step <= currentStep ? 'bg-[#A5292A]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )

  const services = [
    { id: 'corporate', title: 'Corporate advisory', description: 'Incorporation, governance, and general counsel', icon: Building2 },
    { id: 'startup', title: 'Startup & funding', description: 'Incorporation, VC funding, and growth strategy', icon: Zap },
    { id: 'web3', title: 'Web3 & blockchain', description: 'DeFi, NFTs, tokens, and crypto compliance', icon: Coins },
    { id: 'contract', title: 'Contract review', description: 'Drafting, reviewing, and managing agreements', icon: FileText },
    { id: 'dispute', title: 'Dispute resolution', description: 'Arbitration, mediation, and litigation support', icon: Gavel },
    { id: 'ip', title: 'Intellectual property', description: 'Trademarks, patents, and IP protection', icon: Lightbulb }
  ]

  const renderStep1 = () => (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-8">
        <span className="text-sm font-semibold text-gray-600">STEP 1 OF 4</span>
      </div>

      {renderProgressBar()}

      <h1 className="text-4xl font-bold mb-2 text-gray-900">How can we help you?</h1>
      <p className="text-gray-600 mb-8">
        Select all that apply — this helps us prepare the right legal team for your consultation.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {services.map((service) => {
          const Icon = service.icon
          const isSelected = formData.selectedServices?.includes(service.id) || false
          
          return (
            <button
              key={service.id}
              onClick={() => handleServiceToggle(service.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-[#A5292A] bg-[#A5292A]/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-[#A5292A]' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Something else? Describe your need
        </label>
        <textarea
          value={formData.customNeeds}
          onChange={(e) => setFormData(prev => ({ ...prev, customNeeds: e.target.value }))}
          placeholder="e.g. I need help reviewing an employment agreement for a new hire..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A] resize-none"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleStep1Continue}
          disabled={isLoading || formData.selectedServices.length === 0}
          className="px-8 py-3 bg-[#A5292A] text-white rounded-full font-semibold hover:bg-[#8a2123] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-8">
        <span className="text-sm font-semibold text-gray-600">STEP 2 OF 4</span>
      </div>

      {renderProgressBar()}

      <h1 className="text-4xl font-bold mb-2 text-gray-900">Your details</h1>
      <p className="text-gray-600 mb-8">
        We'll use this to confirm your booking and send your meeting details. Everything you share is kept confidential.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">First name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Jane"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Last name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Smith"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="jane@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company / Organisation</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Acme Corp (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">How did you hear about us?</label>
            <select
              value={formData.heardAbout}
              onChange={(e) => setFormData(prev => ({ ...prev, heardAbout: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
            >
              <option value="">Select...</option>
              <option value="google">Google Search</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Brief description of your matter</label>
          <textarea
            value={formData.matterDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, matterDescription: e.target.value }))}
            placeholder="Briefly describe the legal matter you need help with..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A] resize-none"
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="text-[#A5292A] font-semibold hover:underline"
        >
          ← Back
        </button>
        <button
          onClick={handleStep2Continue}
          disabled={isLoading}
          className="px-8 py-3 bg-[#A5292A] text-white rounded-full font-semibold hover:bg-[#8a2123] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-8">
        <span className="text-sm font-semibold text-gray-600">STEP 3 OF 4</span>
      </div>

      {renderProgressBar()}

      <h1 className="text-4xl font-bold mb-2 text-gray-900">Schedule your consultation</h1>
      <p className="text-gray-600 mb-8">
        Pick a date and time that works for you. A confirmation email with your Google Meet link will be sent immediately.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="bg-[#A5292A] text-white rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-lg">20-min Free Legal Consultation</h2>
        <p className="text-[#A5292A]/80 mt-1">Fathom Legal — an attorney will be matched to your matter</p>
      </div>

      <div className="space-y-8 mb-8">
        {/* Calendly Embed */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
            <Calendar className="w-5 h-5" />
            Select a date and time
          </label>
          {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={`${process.env.NEXT_PUBLIC_CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_block=1&background_color=ffffff`}
                width="100%"
                height="700"
                frameBorder="0"
                className="rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-semibold">Calendly URL not configured</p>
              <p className="text-xs mt-1">Please add NEXT_PUBLIC_CALENDLY_URL to your environment variables</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3">Select your preferred date and time from the calendar above</p>
        </div>

        {/* Email Confirmation */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Confirm your email *
          </label>
          <input
            type="email"
            value={schedulingData.confirmedEmail}
            onChange={(e) => setSchedulingData(prev => ({ ...prev, confirmedEmail: e.target.value }))}
            placeholder={formData.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A5292A] focus:ring-1 focus:ring-[#A5292A]"
          />
          <p className="text-xs text-gray-500 mt-2">Confirmation email and Google Meet link will be sent to this address</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="text-[#A5292A] font-semibold hover:underline"
        >
          ← Back
        </button>
        <button
          onClick={handleStep3Continue}
          disabled={isLoading || !schedulingData.confirmedEmail}
          className="px-8 py-3 bg-[#A5292A] text-white rounded-full font-semibold hover:bg-[#8a2123] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Confirm & schedule →
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-8 p-4 bg-blue-50 rounded-lg">
        <strong>Privacy Notice:</strong> In accordance with Bar Council of India regulations, this intake form is provided for clients voluntarily seeking information about Fathom Legal. It does not constitute advertising or solicitation.
      </p>
    </div>
  )

  const renderStep4 = () => (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-8">
        <span className="text-sm font-semibold text-gray-600">CONFIRMED</span>
      </div>

      {renderProgressBar()}

      <div className="bg-[#A5292A] text-white rounded-lg p-12 mb-12 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Your consultation is booked</h1>
        <p className="text-[#A5292A]/80">A confirmation has been sent to {schedulingData.confirmedEmail}</p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Name</span>
            <span className="text-gray-900 font-semibold">{formData.firstName} {formData.lastName}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Date</span>
            <span className="text-gray-900 font-semibold">
              {new Date(schedulingData.selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Time</span>
            <span className="text-gray-900 font-semibold">{schedulingData.selectedTime} IST</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Duration</span>
            <span className="text-gray-900 font-semibold">20 minutes · Google Meet</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Matter</span>
            <span className="text-gray-900 font-semibold text-right">{formData.selectedServices.join(', ')}</span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-gray-600 font-medium">Meeting Link</span>
            <a
              href={schedulingData.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A5292A] font-semibold hover:underline"
            >
              Join Google Meet
            </a>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-3">Before Your Consultation</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Ensure you have a stable internet connection</li>
          <li>✓ Join 5 minutes early for technical checks</li>
          <li>✓ Have any relevant documents ready to discuss</li>
          <li>✓ Choose a quiet location for the meeting</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStartNew}
          className="px-8 py-3 bg-[#A5292A] text-white rounded-full font-semibold hover:bg-[#8a2123] transition-colors"
        >
          ✓ Start New Intake
        </button>
        <Link href="/">
          <button className="px-8 py-3 border-2 border-[#A5292A] text-[#A5292A] rounded-full font-semibold hover:bg-[#A5292A]/5 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg">
        <strong>Privacy Notice:</strong> In accordance with Bar Council of India regulations, this intake form is provided for clients voluntarily seeking information about Fathom Legal. It does not constitute advertising or solicitation.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Website Navbar */}
      <Navbar page="client-intake" />

      {/* Custom Client Intake Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A5292A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖️</span>
            </div>
            <span className="font-bold text-gray-900">Fathom Legal</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-[#A5292A]">CLIENT INTAKE</span>
            {sessionId && <p className="text-xs text-gray-500 mt-1">Session: {sessionId.substring(0, 15)}...</p>}
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-grow">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Website Footer */}
      <Footer />
    </div>
  )
}
