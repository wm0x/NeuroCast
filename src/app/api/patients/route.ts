import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المرضى' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { fullName, age, gender, mrn } = await req.json();
    const genderInt = gender === "Male" ? 1 : 2;

    const newPatient = await db.patient.create({
      data: {
        patientId: mrn, 
        fullName: fullName,
        gender: genderInt,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'رقم الملف الطبي موجود مسبقاً' }, { status: 400 });
    }
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة المريض' }, { status: 500 });
  }
}