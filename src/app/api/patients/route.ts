import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      orderBy: { createdAt: 'desc' },
      // 💡 استخدمنا select لجلب البيانات التي يحتاجها الجدول فقط لتسريع الاستجابة
      select: {
        id: true,
        patientId: true,
        fullName: true,
        gender: true,
        educationYears: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المرضى' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 💡 تحديث المتغيرات لتتطابق مع الـ Schema الجديدة
    const body = await req.json();
    const { patientId, fullName, gender, educationYears } = body;

    // التعامل مع نوع الجنس سواء جاء كنص أو كرقم
    const genderInt = (gender === "Male" || gender === "1" || gender === 1) ? 1 : 2;

    const newPatient = await db.patient.create({
      data: {
        patientId: patientId, 
        fullName: fullName || "Unknown",
        gender: genderInt,
        educationYears: educationYears ? Number(educationYears) : null,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: any) {
    console.error("Error creating patient:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'رقم الملف الطبي (Patient ID) موجود مسبقاً' }, { status: 400 });
    }
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة المريض' }, { status: 500 });
  }
}