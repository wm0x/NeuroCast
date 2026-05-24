import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '(id) not found' }, { status: 400 });
    }

    const doctor = await db.user.findUnique({
      where: { 
        id: id 
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'الدكتور غير موجود' }, { status: 404 });
    }

    const totalPatients = await db.patient.count({
      where: {
        doctorId: id,
      },
    });



    return NextResponse.json({ 
      doctorInfo: {
        id: doctor.id,
        name: doctor.name,
        username: doctor.username,
        role: doctor.role,
        specialization: "Neurologist",
      },
      stats: {
        totalPatients,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الدكتور' }, { status: 500 });
  }
}