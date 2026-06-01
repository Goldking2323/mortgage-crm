import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    auth: { user, pass },
  });
}

interface LeadEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  purchasePrice?: number | null;
  downPayment?: number | null;
  creditRange?: string;
  employment?: string | null;
  referredBy?: string | null;
  message?: string | null;
}

export async function sendNewLeadEmail(lead: LeadEmailData) {
  const transporter = getTransporter();
  const to = process.env.NOTIFY_EMAIL;

  if (!transporter || !to) return;

  const propertyLabel: Record<string, string> = {
    PURCHASE: "Purchase",
    REFINANCE: "Refinance",
    RENEWAL: "Renewal",
    HELOC: "HELOC",
    CONSTRUCTION: "Construction",
  };

  const formatCAD = (n: number | null | undefined) =>
    n ? new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n) : "—";

  await transporter.sendMail({
    from: `"Mortgage CRM" <${process.env.SMTP_USER}>`,
    to,
    subject: `New lead: ${lead.firstName} ${lead.lastName} — ${propertyLabel[lead.propertyType] ?? lead.propertyType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="background: #1e40af; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">New Mortgage Lead</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 14px;">${propertyLabel[lead.propertyType] ?? lead.propertyType}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 40%;">Name</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600;">${lead.firstName} ${lead.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;"><a href="tel:${lead.phone}" style="color: #1d4ed8;">${lead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;"><a href="mailto:${lead.email}" style="color: #1d4ed8;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Purchase Price</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${formatCAD(lead.purchasePrice)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Down Payment</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${formatCAD(lead.downPayment)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Credit Range</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-transform: capitalize;">${(lead.creditRange ?? "Unknown").toLowerCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Employment</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${lead.employment ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Referred By</td>
            <td style="padding: 8px 0; font-size: 14px;">${lead.referredBy ?? "—"}</td>
          </tr>
        </table>

        ${lead.message ? `
        <div style="margin-top: 20px; background: #f8fafc; border-left: 3px solid #1d4ed8; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${lead.message}</p>
        </div>
        ` : ""}

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/leads" style="display: inline-block; background: #1d4ed8; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
            View in CRM →
          </a>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          Mortgage CRM · Ontario Mortgage Agent
        </p>
      </div>
    `,
    text: `
New Mortgage Lead — ${propertyLabel[lead.propertyType] ?? lead.propertyType}

Name: ${lead.firstName} ${lead.lastName}
Phone: ${lead.phone}
Email: ${lead.email}
Purchase Price: ${formatCAD(lead.purchasePrice)}
Down Payment: ${formatCAD(lead.downPayment)}
Credit Range: ${lead.creditRange ?? "Unknown"}
Employment: ${lead.employment ?? "—"}
Referred By: ${lead.referredBy ?? "—"}
${lead.message ? `\nMessage:\n${lead.message}` : ""}

View in CRM: ${process.env.NEXTAUTH_URL}/leads
    `.trim(),
  });
}
