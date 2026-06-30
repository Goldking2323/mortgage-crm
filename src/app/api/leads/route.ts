import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNewLeadEmail } from "@/lib/email";
import { getEstimatedRate } from "@/lib/rates";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { firstName, lastName, email, phone, propertyType, purchasePrice, downPayment, creditRange, employment, referredBy, referralType, message, rateType, term } = body;

  if (!firstName || !lastName || !email || !phone || !propertyType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedPrice = purchasePrice ? parseFloat(purchasePrice) : null;
  const parsedDownPayment = downPayment ? parseFloat(downPayment) : null;
  const parsedTerm = term ? parseInt(term, 10) : null;

  const estimate = getEstimatedRate({
    propertyType,
    purchasePrice: parsedPrice,
    downPayment: parsedDownPayment,
    rateType: rateType || null,
    term: parsedTerm,
  });

  const lead = await prisma.lead.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      propertyType,
      purchasePrice: parsedPrice,
      downPayment: parsedDownPayment,
      creditRange: creditRange || "UNKNOWN",
      employment: employment || null,
      referredBy: referredBy || null,
      referralType: referralType || null,
      message: message || null,
      rateType: rateType || null,
      term: parsedTerm,
      quotedRate: estimate.available ? estimate.rate : null,
    },
  });

  // Fire-and-forget — don't fail the response if email fails
  sendNewLeadEmail(lead).catch(console.error);

  return NextResponse.json({ success: true, leadId: lead.id, estimate }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: { select: { id: true } } },
  });

  return NextResponse.json(leads);
}
