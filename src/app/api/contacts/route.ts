import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leadId, ...data } = await req.json();

  const contact = await prisma.contact.upsert({
    where: { leadId },
    update: data,
    create: { leadId, ...data },
  });

  return NextResponse.json(contact);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead: true,
      followUps: { where: { completed: false }, orderBy: { dueDate: "asc" } },
    },
  });

  return NextResponse.json(contacts);
}
