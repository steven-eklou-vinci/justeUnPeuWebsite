import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/database/mongodb';
import { ObjectId } from 'mongodb';
import { sendOrderConfirmationEmail } from '@/lib/email/sendgrid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ success: false, error: 'PaymentIntent ID manquant' }, { status: 400 });
    }

    // Vérifier l'authentification
    const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
    const userId = new ObjectId(decoded.id);

    // Récupérer la DB
    const db = await getDb();

    // Vérifier si la commande existe déjà pour ce PaymentIntent
    const existingOrder = await db.collection('orders').findOne({ paymentIntentId });
    
    if (existingOrder) {
      // La commande a déjà été créée, retourner simplement l'orderId
      return NextResponse.json({
        success: true,
        orderId: existingOrder.orderId,
      });
    }

    // Récupérer le PaymentIntent depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ success: false, error: 'Paiement non confirmé' }, { status: 400 });
    }

    // Récupérer le panier et l'utilisateur
    const cart = await db.collection('carts').findOne({ userId });
    const user = await db.collection('users').findOne({ _id: userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Panier vide' }, { status: 400 });
    }

    // Récupérer les infos de livraison depuis les metadata
    let shippingInfo = null;
    try {
      if (paymentIntent.metadata?.shippingInfo) {
        shippingInfo = JSON.parse(paymentIntent.metadata.shippingInfo);
      }
    } catch (e) {
      logger.warn('Failed to parse shipping info from metadata');
    }

    // Créer la commande
    const orderId = `ORD-${Date.now()}-${userId.toString().slice(-6)}`;
    const order = {
      orderId,
      userId,
      email: shippingInfo?.email || user?.email || decoded.email || '',
      firstName: shippingInfo?.firstName || user?.firstName || '',
      lastName: shippingInfo?.lastName || user?.lastName || '',
      phone: shippingInfo?.phone || '',
      shippingAddress: shippingInfo ? {
        street: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      } : null,
      items: cart.items,
      subtotal: paymentIntent.amount / 100,
      shipping: 0,
      tax: 0,
      total: paymentIntent.amount / 100,
      paymentIntentId,
      paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
      status: 'paid',
      createdAt: new Date(),
      orderDate: new Date().toISOString(),
    };

    // Sauvegarder la commande
    const result = await db.collection('orders').insertOne(order);

    if (!result.insertedId) {
      throw new Error('Impossible de créer la commande');
    }

    // Vider le panier
    await db.collection('carts').updateOne(
      { userId },
      { $set: { items: [], updatedAt: new Date() } }
    );

    // Email de confirmation désactivé pour le moment
    // TODO: Réactiver quand SendGrid sera configuré
    logger.info({ orderId, email: order.email }, 'Order created (email disabled)');

    logger.info({ orderId, userId: userId.toString(), amount: order.total }, 'Order created successfully');

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
    });
  } catch (error: any) {
    logger.error({ error }, 'Error confirming payment');
    return NextResponse.json({ success: false, error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
