/**
 * Resend email utility
 * Docs: https://resend.com/docs
 *
 * Requires RESEND_API_KEY in .env.local
 * Get a free key at https://resend.com (3,000 emails/month free)
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@circularcoffee.org";
const ADMIN = process.env.RESEND_ADMIN_EMAIL ?? "getahunnegash12@gmail.com";

// ─── Guard ────────────────────────────────────────────────────────────────────
function hasKey(): boolean {
  const k = process.env.RESEND_API_KEY ?? "";
  return k.length > 0 && !k.startsWith("re_your");
}

// ─── HTML layout helper ───────────────────────────────────────────────────────
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <style>
    body{margin:0;padding:0;background:#0d1a0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e8f5e9}
    .wrap{max-width:600px;margin:0 auto;padding:40px 20px}
    .card{background:#1a2e1a;border-radius:16px;padding:40px;border:1px solid #2d4a2d}
    .logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
    .badge{background:linear-gradient(135deg,#4caf50,#8bc34a);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#0d1a0d}
    .brand{font-size:18px;font-weight:700;color:#e8f5e9}
    .brand-sub{font-size:11px;color:#81c784;letter-spacing:0.15em;text-transform:uppercase}
    h1{font-size:24px;font-weight:700;color:#e8f5e9;margin:0 0 16px}
    p{font-size:15px;line-height:1.6;color:#a5d6a7;margin:0 0 16px}
    .pill{display:inline-block;padding:4px 12px;border-radius:100px;background:rgba(76,175,80,0.15);color:#81c784;font-size:12px;font-weight:600;letter-spacing:0.05em;margin-bottom:20px}
    .divider{border:none;border-top:1px solid #2d4a2d;margin:24px 0}
    .field-row{display:flex;gap:8px;margin-bottom:12px}
    .field-label{font-size:12px;font-weight:600;color:#81c784;text-transform:uppercase;letter-spacing:0.08em;min-width:90px;padding-top:2px}
    .field-value{font-size:14px;color:#c8e6c9;flex:1}
    .btn{display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#4caf50,#8bc34a);color:#0d1a0d;font-weight:700;font-size:14px;text-decoration:none}
    .footer{text-align:center;margin-top:32px;font-size:12px;color:#558b5a;line-height:1.8}
    .footer a{color:#81c784;text-decoration:none}
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="logo">
      <div class="badge">C</div>
      <div>
        <div class="brand">Circular Coffee</div>
        <div class="brand-sub">CARES Research Hub</div>
      </div>
    </div>
    ${body}
  </div>
  <div class="footer">
    © ${new Date().getFullYear()} Circular Coffee CARES · University of Antwerp &amp; Addis Ababa University<br/>
    <a href="https://circularcoffee.org">circularcoffee.org</a> · <a href="mailto:info@circularcoffee.org">info@circularcoffee.org</a>
  </div>
</div>
</body>
</html>`;
}

// ─── 1. Contact confirmation to user ─────────────────────────────────────────
export async function sendContactConfirmation(opts: {
  to: string;
  name: string;
  subject: string;
}): Promise<void> {
  if (!hasKey()) return;
  const body = `
    <span class="pill">Message Received</span>
    <h1>Thank you, ${opts.name}!</h1>
    <p>We've received your message regarding <strong style="color:#c8e6c9">"${opts.subject}"</strong> and will get back to you within 3 working days.</p>
    <hr class="divider"/>
    <p>In the meantime, explore our latest research, publications, and field stories at <a href="https://circularcoffee.org" style="color:#81c784">circularcoffee.org</a>.</p>
    <br/>
    <a href="https://circularcoffee.org/library" class="btn">Browse Publications →</a>
    <hr class="divider"/>
    <p style="font-size:13px;color:#558b5a">If you did not submit this form, you can safely ignore this email.</p>
  `;
  await resend.emails.send({
    from: `Circular Coffee CARES <${FROM}>`,
    to: opts.to,
    subject: `We received your message: "${opts.subject}"`,
    html: layout("Message Received – Circular Coffee", body),
  });
}

// ─── 2. Admin notification for new contact message ────────────────────────────
export async function sendAdminContactNotification(opts: {
  name: string;
  email: string;
  organisation?: string;
  subject: string;
  body: string;
}): Promise<void> {
  if (!hasKey()) return;
  const rows = [
    ["Name", opts.name],
    ["Email", opts.email],
    ...(opts.organisation ? [["Org", opts.organisation]] : []),
    ["Subject", opts.subject],
  ];
  const fieldRows = rows
    .map(
      ([l, v]) =>
        `<div class="field-row"><span class="field-label">${l}</span><span class="field-value">${v}</span></div>`
    )
    .join("");
  const htmlBody = `
    <span class="pill">New Contact Message</span>
    <h1>New message from ${opts.name}</h1>
    ${fieldRows}
    <hr class="divider"/>
    <p style="color:#c8e6c9;white-space:pre-wrap;background:rgba(0,0,0,0.2);padding:16px;border-radius:8px;font-size:14px">${opts.body}</p>
    <br/>
    <a href="${process.env.NEXTAUTH_URL ?? "https://circularcoffee.org"}/admin/messages" class="btn">View in Admin →</a>
  `;
  await resend.emails.send({
    from: `Circular Coffee CARES <${FROM}>`,
    to: ADMIN,
    replyTo: opts.email,
    subject: `[CARES Contact] ${opts.subject} — from ${opts.name}`,
    html: layout("New Contact Message", htmlBody),
  });
}

// ─── 3. Newsletter welcome email ──────────────────────────────────────────────
export async function sendNewsletterWelcome(opts: {
  to: string;
  name?: string;
}): Promise<void> {
  if (!hasKey()) return;
  const greeting = opts.name ? `Hello, ${opts.name}!` : "Hello!";
  const body = `
    <span class="pill">Newsletter</span>
    <h1>${greeting} You're subscribed 🌱</h1>
    <p>Welcome to the <strong style="color:#c8e6c9">CARES Quarterly Newsletter</strong>. You'll receive updates on:</p>
    <ul style="color:#a5d6a7;font-size:15px;line-height:1.9;padding-left:20px;margin:0 0 20px">
      <li>Latest research breakthroughs on soil health &amp; waste valorization</li>
      <li>Field stories from Ethiopian coffee cooperatives</li>
      <li>Upcoming events, webinars, and workshops</li>
      <li>New publications, policy briefs, and open-access reports</li>
    </ul>
    <hr class="divider"/>
    <p>Expect your first issue within the next quarter. In the meantime, catch up on our published work:</p>
    <br/>
    <a href="https://circularcoffee.org/library" class="btn">Explore the Library →</a>
    <hr class="divider"/>
    <p style="font-size:13px;color:#558b5a">You can unsubscribe at any time by replying to any newsletter with "unsubscribe".</p>
  `;
  await resend.emails.send({
    from: `Circular Coffee CARES <${FROM}>`,
    to: opts.to,
    subject: "You're subscribed to the CARES Quarterly Newsletter",
    html: layout("CARES Newsletter Subscription Confirmed", body),
  });
}

// ─── 4. Send newsletter blast (quarterly update) ──────────────────────────────
export async function sendNewsletterBlast(opts: {
  subscribers: string[];
  subject: string;
  headline: string;
  intro: string;
  sections: { title: string; content: string; link?: string }[];
}): Promise<{ sent: number; errors: number }> {
  if (!hasKey()) return { sent: 0, errors: 0 };

  const sectionHtml = opts.sections
    .map(
      (s) => `
      <hr class="divider"/>
      <h1 style="font-size:18px;margin-bottom:8px">${s.title}</h1>
      <p>${s.content}</p>
      ${s.link ? `<a href="${s.link}" style="color:#81c784;font-size:14px">Read more →</a>` : ""}
    `
    )
    .join("");

  const body = `
    <span class="pill">Quarterly Update</span>
    <h1>${opts.headline}</h1>
    <p>${opts.intro}</p>
    ${sectionHtml}
    <hr class="divider"/>
    <br/>
    <a href="https://circularcoffee.org" class="btn">Visit Our Website →</a>
    <hr class="divider"/>
    <p style="font-size:12px;color:#558b5a">You're receiving this because you subscribed to CARES updates. Reply "unsubscribe" to opt out.</p>
  `;

  const html = layout(opts.subject, body);

  // Resend free tier: batch in groups of 100
  let sent = 0;
  let errors = 0;
  const BATCH = 50;
  for (let i = 0; i < opts.subscribers.length; i += BATCH) {
    const batch = opts.subscribers.slice(i, i + BATCH);
    try {
      // Use bcc to avoid exposing addresses
      await resend.emails.send({
        from: `Circular Coffee CARES <${FROM}>`,
        to: FROM,
        bcc: batch,
        subject: opts.subject,
        html,
      });
      sent += batch.length;
    } catch {
      errors += batch.length;
    }
  }
  return { sent, errors };
}
