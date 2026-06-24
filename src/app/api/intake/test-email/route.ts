import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
  try {
    const gmailUser = process.env.GMAIL_USER?.trim()
    const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')

    console.log('[v0] Email Test Endpoint - Checking credentials')
    console.log('[v0] GMAIL_USER exists:', !!gmailUser)
    console.log('[v0] GMAIL_APP_PASSWORD exists:', !!gmailPassword)

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json({
        status: 'FAILED',
        message: 'Email credentials not configured',
        details: {
          hasGMAIL_USER: !!process.env.GMAIL_USER,
          hasGMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD
        }
      }, { status: 500 })
    }

    // Try to create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    })

    console.log('[v0] Verifying SMTP connection...')
    
    // This will throw an error if credentials are invalid
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('[v0] SMTP verification failed:', error.code, error.message)
          reject(error)
        } else {
          console.log('[v0] SMTP verification successful')
          resolve(success)
        }
      })
    })

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Gmail SMTP connection verified successfully',
      details: {
        gmailUser: gmailUser,
        passwordLength: gmailPassword.length,
        host: 'smtp.gmail.com',
        port: 465
      }
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Email test failed:', errorMsg)
    
    return NextResponse.json({
      status: 'FAILED',
      message: 'Gmail SMTP connection failed',
      error: errorMsg,
      details: {
        code: error instanceof Error && 'code' in error ? (error as any).code : 'N/A',
        response: error instanceof Error && 'response' in error ? (error as any).response : 'N/A'
      }
    }, { status: 500 })
  }
}
