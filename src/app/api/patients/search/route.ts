import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const patient = await db.patient.findUnique({
      where: { patientId: patientId },
      include: {
        visits: {
          orderBy: { visitDate: 'desc' }, // ترتيب الزيارات من الأحدث للأقدم
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient, { status: 200 });

  } catch (error: any) {
    console.error("Lookup Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data", details: error.message },
      { status: 500 }
    );
  }
}