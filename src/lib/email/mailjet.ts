import Mailjet from 'node-mailjet';
import { logger } from '../logger';

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
  logger.warn('Mailjet credentials not found. Email functionality will be disabled.');
}

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || '',
  process.env.MAILJET_SECRET_KEY || ''
);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Mailjet
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    logger.warn(`Email not sent - credentials missing. Would send to: ${options.to}`);
    return false;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM || 'noreply@justeunpeu.com',
            Name: process.env.EMAIL_FROM_NAME || 'Juste Un Peu'
          },
          To: [
            {
              Email: options.to
            }
          ],
          Subject: options.subject,
          TextPart: options.text || '',
          HTMLPart: options.html
        }
      ]
    });

    const result = await request;
    
    logger.info({
      to: options.to,
      subject: options.subject,
      result: 'sent'
    }, 'Email sent successfully');

    return true;
  } catch (error) {
    logger.error({ error, to: options.to }, 'Failed to send email');
    return false;
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vérifiez votre adresse email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .button { 
          display: inline-block; 
          background: #000; 
          color: #fff; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
        }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JUSTE UN PEU</h1>
        </div>
        
        <h2>Vérifiez votre adresse email</h2>
        
        <p>Bonjour,</p>
        
        <p>Merci de vous être inscrit sur Juste Un Peu. Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">Vérifier mon email</a>
        </div>
        
        <p>Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :</p>
        <p>${verificationUrl}</p>
        
        <p><strong>Ce lien expirera dans 24 heures.</strong></p>
        
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        
        <div class="footer">
          <p>© 2025 Juste Un Peu. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    JUSTE UN PEU - Vérifiez votre adresse email
    
    Bonjour,
    
    Merci de vous être inscrit sur Juste Un Peu. Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :
    
    ${verificationUrl}
    
    Ce lien expirera dans 24 heures.
    
    Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
    
    © 2025 Juste Un Peu. Tous droits réservés.
  `;

  return sendEmail({
    to: email,
    subject: 'Vérifiez votre adresse email - Juste Un Peu',
    html,
    text
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Réinitialisation de votre mot de passe</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .button { 
          display: inline-block; 
          background: #000; 
          color: #fff; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
        }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JUSTE UN PEU</h1>
        </div>
        
        <h2>Réinitialisation de votre mot de passe</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez demandé la réinitialisation de votre mot de passe sur Juste Un Peu. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
        </div>
        
        <p>Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :</p>
        <p>${resetUrl}</p>
        
        <div class="warning">
          <p><strong>⚠️ Important :</strong></p>
          <ul>
            <li>Ce lien expirera dans 24 heures</li>
            <li>Il ne peut être utilisé qu'une seule fois</li>
            <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2025 Juste Un Peu. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    JUSTE UN PEU - Réinitialisation de votre mot de passe
    
    Bonjour,
    
    Vous avez demandé la réinitialisation de votre mot de passe sur Juste Un Peu. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
    
    ${resetUrl}
    
    IMPORTANT :
    - Ce lien expirera dans 24 heures
    - Il ne peut être utilisé qu'une seule fois
    - Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
    
    © 2025 Juste Un Peu. Tous droits réservés.
  `;

  return sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Juste Un Peu',
    html,
    text
  });
}