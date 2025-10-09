import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongodb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

// Types pour les préférences de cookies
interface CookiePreferences {
  necessary: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token.value, JWT_SECRET) as any;
      
      const db = await connectToDatabase();
      const userId = new ObjectId(decoded.id);

      // Récupérer les préférences de l'utilisateur
      const user = await db.collection('users').findOne(
        { _id: userId },
        { projection: { cookiePreferences: 1 } }
      );

      const preferences = user?.cookiePreferences || {
        necessary: true,
        performance: false,
        functionality: false,
        marketing: false,
        timestamp: new Date().toISOString()
      };

      logger.info(`Cookie preferences retrieved for user ${userId.toString()}`);

      return NextResponse.json({ preferences });

    } catch (jwtError) {
      logger.warn('JWT verification failed');
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }
  } catch (error) {
    logger.error({ error }, 'Error retrieving cookie preferences');
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des préférences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token.value, JWT_SECRET) as any;

      const { preferences } = await request.json();

      // Validation des préférences
      if (!preferences || typeof preferences !== 'object') {
        return NextResponse.json(
          { error: 'Préférences invalides' },
          { status: 400 }
        );
      }

      const validPreferences: CookiePreferences = {
        necessary: true, // Toujours true
        performance: Boolean(preferences.performance),
        functionality: Boolean(preferences.functionality),
        marketing: Boolean(preferences.marketing),
        timestamp: new Date().toISOString()
      };

      const db = await connectToDatabase();
      const userId = new ObjectId(decoded.id);

      // Mettre à jour les préférences de l'utilisateur
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $set: { 
            cookiePreferences: validPreferences,
            updatedAt: new Date()
          } 
        }
      );

      logger.info(`Cookie preferences updated for user ${userId.toString()}`);

      return NextResponse.json({ 
        success: true, 
        preferences: validPreferences 
      });

    } catch (jwtError) {
      logger.warn('JWT verification failed in cookie preferences update');
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }
  } catch (error) {
    logger.error({ error }, 'Error updating cookie preferences');
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des préférences' },
      { status: 500 }
    );
  }
}