import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { forgotPassword } from '@/lib/services/auth';
import { rateLimiters, getClientIP } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    // Rate limiting
    const rateLimit = await rateLimiters.passwordReset.check(clientIP);
    if (!rateLimit.allowed) {
      logger.warn({ ip: clientIP }, 'Password reset rate limit exceeded');
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
    const validatedData = forgotPasswordSchema.parse(body);
    
    // Get base URL for reset email
    const baseUrl = process.env.APP_URL || 'http://localhost:3001';
    
    // Send password reset email
    const result = await forgotPassword(validatedData, baseUrl);
    
    // Always consume rate limit for password reset attempts
    await rateLimiters.passwordReset.consume(clientIP);
    
    // Always return success to prevent email enumeration
    logger.info({ 
      email: validatedData.email,
      ip: clientIP,
      success: result.success
    }, 'Password reset requested');

    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.'
    });

  } catch (error) {
    // Consume rate limit on errors
    await rateLimiters.passwordReset.consume(clientIP);
    
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn({ error: error.message, ip: clientIP }, 'Invalid forgot password data');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Adresse email invalide'
        },
        { status: 400 }
      );
    }

    logger.error({ error, ip: clientIP }, 'Forgot password endpoint error');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur interne est survenue'
      },
      { status: 500 }
    );
  }
}