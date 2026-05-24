import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. جلب بيانات الدكتور الحقيقية من جدول User
    // استخدمنا select لجلب البيانات الآمنة فقط وتجاهل كلمة المرور
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

    // إذا لم يتم العثور على الدكتور، نرجع رسالة خطأ 404
    if (!doctor) {
      return NextResponse.json({ error: 'الدكتور غير موجود' }, { status: 404 });
    }

    // 2. عدّ المرضى المرتبطين بهذا الدكتور فقط من قاعدة البيانات
    const totalPatients = await db.patient.count({
      where: {
        doctorId: id,
      },
    });

    // 3. الإحصائيات الأخرى (يمكنك ربطها بجداول أخرى مستقبلاً)
    const aiPredictions = 856; 
    const pendingReports = 12; 

    // 4. إرجاع جميع البيانات (بيانات الدكتور + الإحصائيات) في استجابة واحدة
    return NextResponse.json({ 
      doctorInfo: {
        id: doctor.id,
        name: doctor.name,
        username: doctor.username,
        role: doctor.role,
        specialization: "Neurologist", // يمكنك إضافته كحقل لقاعدة البيانات لاحقاً إذا أردت
      },
      stats: {
        totalPatients,
        aiPredictions,
        pendingReports
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الدكتور' }, { status: 500 });
  }
}