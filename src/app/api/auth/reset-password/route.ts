import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validation/auth';
import { resetPassword } from '@/lib/services/auth';
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
    const validatedData = resetPasswordSchema.parse(body);
    
    // Reset password
    const result = await resetPassword(validatedData);
    
    if (!result.success) {
      // Consume rate limit on failed attempts
      await rateLimiters.passwordReset.consume(clientIP);
      
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
    }, 'Password reset successfully');

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès.',
      user: result.user
    });

  } catch (error) {
    // Consume rate limit on errors
    await rateLimiters.passwordReset.consume(clientIP);
    
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn({ error: error.message, ip: clientIP }, 'Invalid reset password data');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides'
        },
        { status: 400 }
      );
    }

    logger.error({ error, ip: clientIP }, 'Reset password endpoint error');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur interne est survenue'
      },
      { status: 500 }
    );
  }
}