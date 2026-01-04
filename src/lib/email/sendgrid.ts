import sgMail from '@sendgrid/mail';
import { logger } from '../logger';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  logger.warn('SENDGRID_API_KEY not set — emails will not be sent');
}

export interface OrderItem {
  productId: number | string;
  name: string;
  price: number; // montant par unité
  quantity: number;
  size?: string;
  image?: string;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderPayload {
  orderId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  orderDate?: string; // ISO
}

/**
 * Send order confirmation (thank you) email using SendGrid
 * - Uses project conventions (EMAIL_FROM / EMAIL_FROM_NAME)
 * - Produces HTML + plain text with order summary
 */
export async function sendOrderConfirmationEmail(order: OrderPayload): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    logger.warn('SendGrid key missing; would have sent order confirmation to: ' + order.email);
    return false;
  }

  const fromEmail = process.env.EMAIL_FROM || 'juste.unpeu@outlook.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'Juste Un Peu';

  const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
  const humanDate = orderDate.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  const itemsHtml = order.items.map(item => {
    const lineTotal = (item.price * item.quantity).toFixed(2);
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;vertical-align:middle">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" width="72" style="object-fit:cover;border-radius:6px;margin-right:12px;vertical-align:middle"/>` : ''}
          <div style="display:inline-block;vertical-align:middle">
            <div style="font-weight:600;color:#111">${item.name}</div>
            <div style="font-size:13px;color:#666">Taille: ${item.size ?? '-'} • Qté: ${item.quantity}</div>
          </div>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;vertical-align:middle">${Number(item.price).toFixed(2)} €</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;vertical-align:middle">${lineTotal} €</td>
      </tr>
    `;
  }).join('\n');

  const shippingAddressHtml = order.shippingAddress ? `
    <p style="margin:0 0 8px 0;color:#444">
      ${order.shippingAddress.street ? order.shippingAddress.street + '<br/>' : ''}
      ${order.shippingAddress.postalCode ? order.shippingAddress.postalCode + ' ' : ''}${order.shippingAddress.city ? order.shippingAddress.city + '<br/>' : ''}
      ${order.shippingAddress.country ? order.shippingAddress.country : ''}
    </p>
  ` : '';

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Merci pour votre commande — Juste Un Peu</title>
  </head>
  <body style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f8;margin:0;padding:24px;color:#222">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #eee">
      <div style="padding:28px 32px;background:#fff;border-bottom:1px solid #f0f0f0;text-align:center">
        <h1 style="margin:0;font-size:20px;letter-spacing:0.02em">Merci pour votre commande</h1>
        <p style="margin:8px 0 0;color:#666">Votre commande <strong>#${order.orderId}</strong> a bien été reçue le ${humanDate}</p>
      </div>

      <div style="padding:24px 32px">
        <p style="color:#333">Bonjour ${order.firstName ?? ''} ${order.lastName ?? ''},</p>
        <p style="color:#555">Merci pour votre achat sur <strong>Juste Un Peu</strong>. Voici le récapitulatif de votre commande :</p>

        <table width="100%" style="border-collapse:collapse;margin-top:18px">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;color:#666;font-size:13px">Article</th>
              <th style="text-align:right;padding:8px 12px;color:#666;font-size:13px">Prix</th>
              <th style="text-align:right;padding:8px 12px;color:#666;font-size:13px">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:16px">
          <div style="text-align:right">
            <div style="color:#666;font-size:14px">Sous-total</div>
            <div style="font-weight:700;font-size:16px">${order.subtotal.toFixed(2)} €</div>
          </div>
          <div style="text-align:right">
            <div style="color:#666;font-size:14px">Livraison</div>
            <div style="font-weight:700;font-size:16px">${order.shipping.toFixed(2)} €</div>
          </div>
          <div style="text-align:right">
            <div style="color:#666;font-size:14px">TVA</div>
            <div style="font-weight:700;font-size:16px">${(order.tax ?? 0).toFixed(2)} €</div>
          </div>
          <div style="text-align:right">
            <div style="color:#000;font-size:14px">Total</div>
            <div style="font-weight:800;font-size:18px">${order.total.toFixed(2)} €</div>
          </div>
        </div>

        ${order.shippingAddress ? `
        <div style="margin-top:22px">
          <h4 style="margin:0 0 8px 0;color:#111;font-size:15px">Adresse de livraison</h4>
          ${shippingAddressHtml}
        </div>
        ` : ''}

        ${order.paymentMethod ? `
        <div style="margin-top:18px;color:#666;font-size:14px">Moyen de paiement : <strong style="color:#111">${order.paymentMethod}</strong></div>
        ` : ''}

        <hr style="border:none;border-top:1px solid #f0f0f0;margin:22px 0"/>

      <p style="color:#666;font-size:13px">Si vous avez des questions, répondez simplement à cet email ou contactez-nous via <a href="mailto:${fromEmail}">${fromEmail}</a>.</p>

        <p style="color:#666;font-size:13px;margin-top:12px">Merci encore,</p>
        <p style="font-weight:700;margin:0">L'équipe Juste Un Peu</p>
      </div>

      <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">
        © 2025 Juste Un Peu — <a href="https://justeunpeu.com" style="color:#999;text-decoration:underline">Visitez notre site</a>
      </div>
    </div>
  </body>
  </html>
  `;

  const plainTextItems = order.items.map(i => `- ${i.name} (Taille: ${i.size ?? '-'} | Qté: ${i.quantity}) : ${ (i.price * i.quantity).toFixed(2) } €`).join('\n');

  const text = `
    JUSTE UN PEU - Merci pour votre commande #${order.orderId}

    Bonjour ${order.firstName ?? ''} ${order.lastName ?? ''},

    Merci pour votre achat. Récapitulatif :

    ${plainTextItems}

    Sous-total: ${order.subtotal.toFixed(2)} €
    Livraison: ${order.shipping.toFixed(2)} €
    TVA: ${(order.tax ?? 0).toFixed(2)} €
    Total: ${order.total.toFixed(2)} €

    ${order.shippingAddress ? `Adresse de livraison:\n${order.shippingAddress.street ?? ''}\n${order.shippingAddress.postalCode ?? ''} ${order.shippingAddress.city ?? ''}\n${order.shippingAddress.country ?? ''}` : ''}

    Si vous avez des questions, répondez à cet email : ${fromEmail}

    Merci,
    L'équipe Juste Un Peu
  `;

  const msg = {
    to: order.email,
    from: {
      email: fromEmail,
      name: fromName
    },
    subject: `Merci pour votre commande #${order.orderId} — Juste Un Peu`,
    text: text,
    html: html
  };

  try {
    await sgMail.send(msg as any);
    logger.info({ to: order.email, orderId: order.orderId }, 'Order confirmation sent');
    return true;
  } catch (error: any) {
    logger.error({ error, to: order.email }, 'Failed to send order confirmation');
    return false;
  }
}

/*
Example usage (server-side):

import { sendOrderConfirmationEmail } from '@/lib/email/sendgrid';

await sendOrderConfirmationEmail({
  orderId: 'ORD-20251024-001',
  email: 'client@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  items: [
    { productId: 1, name: 'T-shirt Minimal', price: 45, quantity: 2, size: 'M', image: 'https://.../img.jpg' }
  ],
  subtotal: 90,
  shipping: 5.9,
  tax: 19.71,
  total: 115.61,
  shippingAddress: { street: 'Rue Example 1', city: 'Bruxelles', postalCode: '1000', country: 'Belgique' },
  paymentMethod: 'Carte bancaire',
  orderDate: new Date().toISOString()
});

Environment variables required:
- SENDGRID_API_KEY
- EMAIL_FROM (optional)
- EMAIL_FROM_NAME (optional)
*/