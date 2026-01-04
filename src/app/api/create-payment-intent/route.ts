import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/database/mongodb';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shippingInfo } = body;

    // Vérifier l'authentification
    const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = new ObjectId(decoded.id);

    // Récupérer le panier de l'utilisateur
    const db = await getDb();
    const cart = await db.collection('carts').findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Calculer le total
    const amount = Math.round(cart.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0) * 100); // Montant en centimes

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId.toString(),
        cartId: cart._id.toString(),
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    logger.info({ paymentIntentId: paymentIntent.id, amount, userId: userId.toString() }, 'PaymentIntent created');

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating PaymentIntent');
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
