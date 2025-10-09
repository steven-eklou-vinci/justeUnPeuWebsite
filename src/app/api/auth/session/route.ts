import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/database/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

// Endpoint pour récupérer la session utilisateur actuelle
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = jwt.verify(token.value, JWT_SECRET) as any;
      
      // Récupérer les informations utilisateur actuelles depuis la base de données
      const db = await connectToDatabase();
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(decoded.id) },
        { 
          projection: { 
            passwordHash: 0, // Exclure le mot de passe
            emailVerificationToken: 0,
            passwordResetToken: 0,
            passwordResetExpiry: 0,
            emailVerificationExpiry: 0
          } 
        }
      );

      if (!user) {
        logger.warn({ userId: decoded.id }, 'User not found for valid token');
        return NextResponse.json({ user: null });
      }
      
      return NextResponse.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          address: user.address || {
            street: '',
            city: '',
            postalCode: '',
            country: 'France'
          },
          emailVerified: !!user.emailVerifiedAt
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (jwtError) {
      logger.warn({ error: jwtError }, 'JWT verification failed');
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    logger.error({ error }, 'Session check failed');
    return NextResponse.json({ user: null }, { status: 500 });
  }
}