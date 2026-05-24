import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  // 1. أضفنا Promise هنا في تعريف النوع
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. استخدمنا await لفك الـ params قبل أخذ الـ id منه
    const resolvedParams = await params;
    const patientId = resolvedParams.id;

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" }, 
        { status: 400 }
      );
    }

    // جلب الزيارات من قاعدة البيانات باستخدام Prisma
    const visits = await db.visit.findMany({
      where: {
        patientId: patientId
      },
      orderBy: {
        visitDate: 'desc' 
      },
      select: {
        id: true,
        visitDate: true,
        mmse: true,
        prediction: true,
        confidence: true
      }
    });

    return NextResponse.json(visits, { status: 200 });

  } catch (error) {
    console.error("Error fetching patient visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits. Please try again later." }, 
      { status: 500 }
    );
  }
}