import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contactId, dueDate, title, description } = await req.json();

  const followUp = await prisma.followUp.create({
    data: { contactId, dueDate: new Date(dueDate), title, description },
  });

  return NextResponse.json(followUp);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, completed } = await req.json();

  const followUp = await prisma.followUp.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });

  return NextResponse.json(followUp);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const followUps = await prisma.followUp.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      contact: {
        include: { lead: { select: { firstName: true, lastName: true, phone: true } } },
      },
    },
  });

  return NextResponse.json(followUps);
}
