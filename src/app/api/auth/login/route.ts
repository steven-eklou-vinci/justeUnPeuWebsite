import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/auth';
import { loginUser } from '@/lib/services/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    logger.info({ email: body.email }, 'Login attempt');

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Authenticate user with our MongoDB service
    const result = await loginUser(validatedData);
    
    if (!result.success || !result.user) {
      logger.warn({ email: validatedData.email }, 'Failed login attempt');
      return NextResponse.json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        emailVerified: result.user.emailVerified
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        address: result.user.address,
        emailVerified: result.user.emailVerified
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    logger.info({ userId: result.user.id, email: result.user.email }, 'Successful login');
    return response;

  } catch (error) {
    logger.error({ error }, 'Login API error');
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Données invalides'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Une erreur est survenue lors de la connexion'
    }, { status: 500 });
  }
}