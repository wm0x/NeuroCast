import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    let path = "/";
    
    try {
      const body = await request.json();
      if (body?.path) path = body.path;
    } catch (parseError) {
      // إذا كان الطلب فارغاً، سنكتفي بالمسار الافتراضي "/"
    }
    
    const visit = await prisma.platformTraffic.create({
      data: {
        path: path,
      }
    });

    console.log("✅ Visit tracked successfully:", visit.id); 
    return NextResponse.json({ success: true, id: visit.id });

  } catch (error) {
    console.error("❌ Failed to track visit:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}