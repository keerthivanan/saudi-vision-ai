import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.user_id || !userData.email) {
      return NextResponse.json(
        { error: 'Missing required user data' },
        { status: 400 }
      )
    }

    // Call backend API to store user
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const backendResponse = await fetch(`${backendUrl}/store-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.text()
      console.error('Backend API error:', error)
      return NextResponse.json(
        { error: 'Failed to store user in backend' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in store-user API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
