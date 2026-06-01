import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leadId, status } = await req.json();

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  return NextResponse.json(lead);
}
