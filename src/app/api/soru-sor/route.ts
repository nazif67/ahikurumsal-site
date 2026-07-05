import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, question } = await req.json();

  if (!name?.trim() || !email?.trim() || !question?.trim()) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
  }

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const OWNER_EMAIL = process.env.OWNER_EMAIL || "ismailagaik@gmail.com";

  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      });

      await transporter.sendMail({
        from: `"Ahikurumsal Site" <${GMAIL_USER}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `💬 Yeni Ziyaretçi Sorusu — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="color:#1e3a5f;margin-top:0;">Yeni Ziyaretçi Sorusu</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;width:110px;">Ad Soyad</td>
                <td style="padding:8px 0;font-weight:600;color:#111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;">E-posta</td>
                <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1e3a5f;">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Telefon</td><td style="padding:8px 0;color:#111827;">${phone}</td></tr>` : ""}
            </table>
            <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;border-left:3px solid #1e3a5f;">
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">${question.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="margin-top:20px;font-size:12px;color:#9ca3af;">Bu mesaj ahikurumsal.com üzerinden gönderildi. Yanıtlamak için doğrudan "Yanıtla" butonuna basabilirsiniz.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("E-posta gönderilemedi:", err);
    }
  }

  return NextResponse.json({ success: true });
}
