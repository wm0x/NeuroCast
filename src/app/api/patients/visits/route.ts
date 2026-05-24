import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getPredictionRisk(deltaMMSE: number): string {
  if (deltaMMSE < -2) {
    return "High Risk";
  } else if (deltaMMSE < 0) {
    return "Moderate Risk";
  } else {
    return "Low Risk";
  }
}

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
    const currentMmseValue = Number(visit.mmse);
    const rawPredictionOutput = Number(visit.prediction); 
    
    let finalRiskCategory = "Unknown Risk";

    finalRiskCategory = getPredictionRisk(rawPredictionOutput);

    // ==========================================

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

    const newVisit = await db.visit.create({
      data: {
        patientId: patient.patientId,
        ageAtVisit: visit.ageAtVisit,
        mmse: currentMmseValue, 
        aqp7: visit.aqp7,
        rps5: visit.rps5,
        chd2: visit.chd2,
        snx5: visit.snx5,
        ass1: visit.ass1,
        unchar: visit.unchar,
        prediction: finalRiskCategory, 
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