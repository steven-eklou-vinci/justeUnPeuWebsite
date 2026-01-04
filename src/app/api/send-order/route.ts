import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email/sendgrid';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = body.order;

    if (!order || !order.orderId || !order.email) {
      return NextResponse.json({ ok: false, error: 'Invalid payload: order and order.orderId & order.email required' }, { status: 400 });
    }

    const ok = await sendOrderConfirmationEmail(order);
    if (ok) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
  } catch (err: any) {
    logger.error({ err }, 'Error in send-order route');
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
