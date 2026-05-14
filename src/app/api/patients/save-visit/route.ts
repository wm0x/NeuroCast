import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 Data received for saving:", body);

    const { patient_id, fullName, age, mmse, cdrsb, hippocampus_vol } = body;

    // 1. تحديث أو إنشاء المريض
    const patient = await prisma.patient.upsert({
      where: { patientId: patient_id },
      update: { 
        fullName: fullName || undefined 
      },
      create: { 
        patientId: patient_id, 
        fullName: fullName || "Unknown",
        gender: 0 // قيمة افتراضية
      }
    });

    // 2. حفظ الزيارة السريرية
    const visit = await prisma.visit.create({
      data: {
        patientId: patient_id,
        ageAtVisit: parseFloat(age) || 0,
        mmse: parseFloat(mmse) || 0,
        cdrsb: parseFloat(cdrsb) || 0,
        hippocampusVol: parseFloat(hippocampus_vol) || null,
        maeAtVisit: 0.3907
      }
    });

    console.log("✅ Saved to DB:", visit.id);
    return NextResponse.json({ success: true, visit });
  } catch (error) {
    console.error("❌ Database Save Error:", error);
    return NextResponse.json({ error: 'Failed to save visit' }, { status: 500 });
  }
}