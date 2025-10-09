import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/auth';
import { registerUser } from '@/lib/services/auth';
import { rateLimiters, getClientIP } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    // Rate limiting
    const rateLimit = await rateLimiters.register.check(clientIP);
    if (!rateLimit.allowed) {
      logger.warn({ ip: clientIP }, 'Registration rate limit exceeded');
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
    const validatedData = registerSchema.parse(body);
    
    // Register user
    const result = await registerUser(validatedData);
    
    if (!result.success) {
      // Consume rate limit on failed attempts
      await rateLimiters.register.consume(clientIP);
      
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
      email: validatedData.email,
      ip: clientIP 
    }, 'User registered successfully');

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.',
      user: result.user
    });

  } catch (error) {
    // Consume rate limit on errors
    await rateLimiters.register.consume(clientIP);
    
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn({ error: error.message, ip: clientIP }, 'Invalid registration data');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: error.message
        },
        { status: 400 }
      );
    }

    logger.error({ error, ip: clientIP }, 'Registration endpoint error');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur interne est survenue'
      },
      { status: 500 }
    );
  }
}