import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/database/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

export async function GET(req: Request) {
  try {
    // Vérifier l'authentification
    const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = new ObjectId(decoded.id);

    // Récupérer les commandes de l'utilisateur
    const db = await getDb();
    const orders = await db
      .collection('orders')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    logger.info({ userId: userId.toString(), orderCount: orders.length }, 'Orders retrieved');

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    logger.error({ error }, 'Error retrieving orders');
    return NextResponse.json({ success: false, error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
