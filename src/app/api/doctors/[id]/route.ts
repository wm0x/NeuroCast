import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Extract ID from the query string (?id=...)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
    }

    // 1. جلب بيانات الدكتور الحقيقية من جدول User
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
      return NextResponse.json({ error: "Doctor Not Found" }, { status: 404 });
    }

    // 2. عدّ المرضى المرتبطين بهذا الدكتور فقط من قاعدة البيانات
    const totalPatients = await db.patient.count({
      where: {
        doctorId: id,
      },
    });

    // 3. الإحصائيات الأخرى
    const aiPredictions = 856; 
    const pendingReports = 12; 

    // 4. إرجاع جميع البيانات في استجابة واحدة
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
        aiPredictions,
        pendingReports
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      // 1. استخراج الـ ID بنفس الطريقة التي استخدمتها في الـ GET
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
      }
  
      // 2. التحقق من وجود الدكتور أولاً (اختياري ولكنه أفضل)
      const existingDoctor = await db.user.findUnique({
        where: { id: id }
      });
  
      if (!existingDoctor) {
        return NextResponse.json({ error: "Doctor Not Found" }, { status: 404 });
      }
  
      // 3. حذف الدكتور من قاعدة البيانات
      await db.user.delete({
        where: { id: id }
      });
  
      // 4. إرجاع استجابة نجاح (هذا ما سيمنع خطأ الـ JSON في الواجهة)
      return NextResponse.json({ 
        success: true, 
        message: "تم حذف الدكتور بنجاح" 
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return NextResponse.json({ error: "Error deleting doctor" }, { status: 500 });
    }
  }