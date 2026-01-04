// send-test-email.js
// Simple test script to send an order confirmation-like email via SendGrid
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY not set in environment');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const to = 'steven.eklou@outlook.com';
const from = process.env.EMAIL_FROM || 'juste.unpeu@outlook.com';

const html = `
  <h1>Merci pour votre commande — Juste Un Peu</h1>
  <p>Bonjour Steven,</p>
  <p>Ceci est un email de test pour vérifier l'intégration SendGrid.</p>
  <h3>Résumé de la commande</h3>
  <ul>
    <li>T-shirt Minimal — Taille M — Qté: 2 — Prix unitaire: 45,00 €</li>
  </ul>
  <p><strong>Total: 90,00 €</strong></p>
  <p>Merci pour votre achat !</p>
  <hr/>
  <p>Suivez-nous :
    <a href="https://www.instagram.com/justeunpeu.be?igsh=MWZyNTBoNW9kbnprNg==">Instagram</a>
    —
    <a href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40justeunpeu.be">TikTok</a>
  </p>
`;

const msg = {
  to,
  from,
  subject: 'Test d\'intégration SendGrid — Juste Un Peu',
  text: 'Test d\'envoi SendGrid — votre message doit arriver.',
  html
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email de test envoyé avec succès à', to);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erreur lors de l\'envoi :');
    if (err && err.response && err.response.body) {
      console.error(JSON.stringify(err.response.body, null, 2));
    } else {
      console.error(err && err.message ? err.message : err);
    }
    process.exit(2);
  });
