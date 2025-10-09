import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getUserCart, saveUserCart, clearUserCart } from '@/lib/services/cart';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

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

// GET - Récupérer le panier de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const items = await getUserCart(user.id);
    
    return NextResponse.json({
      success: true,
      items
    });

  } catch (error) {
    logger.error({ error }, 'Cart retrieval error');
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération du panier'
    }, { status: 500 });
  }
}

// PUT - Sauvegarder le panier de l'utilisateur
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const { items } = await req.json();
    
    const success = await saveUserCart(user.id, items);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la sauvegarde du panier'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Panier sauvegardé avec succès'
    });

  } catch (error) {
    logger.error({ error }, 'Cart save error');
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la sauvegarde du panier'
    }, { status: 500 });
  }
}

// DELETE - Vider le panier de l'utilisateur
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const success = await clearUserCart(user.id);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la suppression du panier'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Panier vidé avec succès'
    });

  } catch (error) {
    logger.error({ error }, 'Cart clear error');
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression du panier'
    }, { status: 500 });
  }
}