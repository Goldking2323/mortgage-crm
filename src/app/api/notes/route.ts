import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contactId, content, type } = await req.json();

  const note = await prisma.note.create({
    data: { contactId, content, type: type || "general" },
  });

  return NextResponse.json(note);
}
