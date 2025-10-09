import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailSchema } from '@/lib/validation/auth';
import { verifyEmail } from '@/lib/services/auth';
import { rateLimiters, getClientIP } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    // Rate limiting
    const rateLimit = await rateLimiters.emailVerification.check(clientIP);
    if (!rateLimit.allowed) {
      logger.warn({ ip: clientIP }, 'Email verification rate limit exceeded');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Trop de tentatives. Réessayez plus tard.',
          retryAfter: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validatedData = verifyEmailSchema.parse(body);
    
    // Verify email
    const result = await verifyEmail(validatedData.token);
    
    if (!result.success) {
      // Consume rate limit on failed attempts
      await rateLimiters.emailVerification.consume(clientIP);
      
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          code: result.code
        },
        { status: 400 }
      );
    }

    logger.info({ 
      userId: result.user?.id,
      email: result.user?.email,
      ip: clientIP 
    }, 'Email verified successfully');

    return NextResponse.json({
      success: true,
      message: 'Email vérifié avec succès.',
      user: result.user
    });

  } catch (error) {
    // Consume rate limit on errors
    await rateLimiters.emailVerification.consume(clientIP);
    
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn({ error: error.message, ip: clientIP }, 'Invalid email verification data');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token invalide'
        },
        { status: 400 }
      );
    }

    logger.error({ error, ip: clientIP }, 'Email verification endpoint error');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur interne est survenue'
      },
      { status: 500 }
    );
  }
}