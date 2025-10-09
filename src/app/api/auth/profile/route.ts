import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/database/mongodb';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

// Schema pour la mise à jour du profil
const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50).optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50).optional(),
  phone: z.string().min(10, 'Numéro de téléphone invalide').max(15).optional(),
  address: z.object({
    street: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(10).optional(),
    country: z.string().max(100).optional()
  }).optional(),
  preferences: z.object({
    newsletter: z.boolean().optional(),
    promotions: z.boolean().optional(),
    language: z.enum(['fr', 'en']).optional()
  }).optional()
});

async function getUserFromToken(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    logger.error({ error }, 'Token verification failed');
    return null;
  }
}

// GET - Récupérer les informations du profil
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const db = await connectToDatabase();
    const userProfile = await db.collection('users').findOne(
      { _id: new ObjectId(user.id) },
      { 
        projection: { 
          password: 0, // Exclure le mot de passe
          emailVerificationToken: 0,
          passwordResetToken: 0,
          passwordResetExpiry: 0,
          emailVerificationExpiry: 0
        } 
      }
    );

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    logger.info({ userId: user.id }, 'Profile retrieved');

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile._id,
        email: userProfile.email,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phone: userProfile.phone || '',
        emailVerified: userProfile.emailVerified || !!userProfile.emailVerifiedAt,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt,
        address: userProfile.address || {
          street: '',
          city: '',
          postalCode: '',
          country: 'France'
        },
        preferences: userProfile.preferences || {
          newsletter: false,
          promotions: false,
          language: 'fr'
        }
      }
    });

  } catch (error) {
    logger.error({ error }, 'Profile retrieval error');
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération du profil'
    }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const body = await req.json();
    
    // Valider les données
    const validatedData = updateProfileSchema.parse(body);

    const db = await connectToDatabase();
    
    // Préparer la mise à jour
    const updateData: any = {
      updatedAt: new Date()
    };

    if (validatedData.firstName) updateData.firstName = validatedData.firstName;
    if (validatedData.lastName) updateData.lastName = validatedData.lastName;
    if (validatedData.phone) updateData.phone = validatedData.phone;
    if (validatedData.address) updateData.address = validatedData.address;
    if (validatedData.preferences) updateData.preferences = validatedData.preferences;

    // Mettre à jour le profil
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(user.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    logger.info({ userId: user.id, updatedFields: Object.keys(updateData) }, 'Profile updated');

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    logger.error({ error }, 'Profile update error');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Données invalides',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour du profil'
    }, { status: 500 });
  }
}