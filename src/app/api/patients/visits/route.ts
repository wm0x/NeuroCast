import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, fullName, gender, educationYears, visit } = body;

    if (!patientId || !visit) {
      return NextResponse.json(
        { error: "Missing required fields: patientId or visit data" },
        { status: 400 }
      );
    }

    // 1. تحديث أو إنشاء المريض
    const patient = await db.patient.upsert({
      where: { patientId: patientId },
      update: {
        ...(fullName && { fullName }),
        ...(gender !== undefined && { gender }),
        ...(educationYears !== undefined && { educationYears }),
      },
      create: {
        patientId: patientId,
        fullName: fullName || "Unknown",
        gender: gender ?? 1,
        educationYears: educationYears ?? null,
      },
    });

    // 2. إنشاء الزيارة وحفظ كل الحقول بما فيها futureMmse
    const newVisit = await db.visit.create({
      data: {
        patientId: patient.patientId,
        ageAtVisit: visit.ageAtVisit,
        mmse: Number(visit.mmse), 
        aqp7: visit.aqp7,
        rps5: visit.rps5,
        chd2: visit.chd2,
        snx5: visit.snx5,
        ass1: visit.ass1,
        chr12q15: visit.chr12q15,
        
        futureMmse: visit.futureMmse, 
        
        prediction: visit.prediction, 
        
        confidence: visit.confidence,
      },
    });

    return NextResponse.json(
      { success: true, patient, visit: newVisit },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Database Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save to database", details: error.message },
      { status: 500 }
    );
  }
}