import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Pour envoyer les emails, installez resend : npm install resend
// et ajoutez RESEND_API_KEY dans vos variables d'environnement
// Créez un compte gratuit sur resend.com (3000 emails/mois gratuits)

const DEST_EMAIL = process.env.CONTACT_EMAIL || "madoumbaye1@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation basique côté serveur
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (message.length < 20) {
      return NextResponse.json({ error: "Message trop court" }, { status: 400 });
    }

    // Si RESEND_API_KEY est configurée, on envoie un vrai email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Dojo.info Contact <contact@dojo.info>",
        to: DEST_EMAIL,
        replyTo: email,
        subject: `[Dojo.info] ${subject} — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0F;color:#E2E8F0;padding:32px;border-radius:12px">
            <h2 style="color:#6C63FF;margin-bottom:24px">📬 Nouveau message depuis Dojo.info</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#94A3B8;width:100px">De :</td><td style="padding:8px 0;color:#E2E8F0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#94A3B8">Email :</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00D9FF">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#94A3B8">Sujet :</td><td style="padding:8px 0;color:#E2E8F0">${subject}</td></tr>
            </table>
            <hr style="border-color:#ffffff15;margin:20px 0"/>
            <h3 style="color:#94A3B8;font-size:14px;margin-bottom:12px">MESSAGE :</h3>
            <div style="background:#ffffff08;border-radius:8px;padding:16px;color:#E2E8F0;line-height:1.6;white-space:pre-wrap">${message}</div>
            <p style="color:#475569;font-size:12px;margin-top:24px">Répondez directement à cet email pour contacter ${name}.</p>
          </div>
        `,
      });
    } else {
      // Fallback : log en console si pas de clé API (développement)
      console.log("=== NOUVEAU MESSAGE DE CONTACT ===");
      console.log(`De: ${name} <${email}>`);
      console.log(`Sujet: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("==================================");
      console.log("💡 Ajoutez RESEND_API_KEY dans .env.local pour activer l'envoi d'emails");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
