import { NextRequest, NextResponse } from 'next/server';

// Simple auth API pour tester sans NextAuth.js
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    user: null, 
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Simple auth request:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auth endpoint working' 
    });
  } catch (error) {
    console.error('Simple auth error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Auth error' 
    }, { status: 500 });
  }
}