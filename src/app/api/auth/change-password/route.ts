import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/database/mongodb';
import { verifyPassword, hashPassword } from '@/lib/security/crypto';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

// Schema pour le changement de mot de passe
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
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

export async function POST(req: NextRequest) {
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
    const validatedData = changePasswordSchema.parse(body);

    const db = await connectToDatabase();
    
    // Récupérer l'utilisateur avec le mot de passe
    const userRecord = await db.collection('users').findOne({
      _id: new ObjectId(user.id)
    });

    if (!userRecord) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      userRecord.passwordHash
    );

    if (!isCurrentPasswordValid) {
      logger.warn({ userId: user.id }, 'Invalid current password for password change');
      return NextResponse.json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      }, { status: 400 });
    }

    // Hacher le nouveau mot de passe
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Mettre à jour le mot de passe
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(user.id) },
      { 
        $set: { 
          passwordHash: hashedNewPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la mise à jour'
      }, { status: 500 });
    }

    logger.info({ userId: user.id }, 'Password changed successfully');

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    logger.error({ error }, 'Change password error');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Données invalides',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erreur lors du changement de mot de passe'
    }, { status: 500 });
  }
}