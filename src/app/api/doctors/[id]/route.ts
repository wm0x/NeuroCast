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

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ id: string }> } // التعديل الأول: تعريف params كـ Promise
  ) {
    try {
      // التعديل الثاني: استخدام await لاستخراج الـ id
      const { id } = await params;
  
      if (!id) {
        return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
      }
  
      // التحقق من وجود الدكتور
      const existingDoctor = await db.user.findUnique({
        where: { id: id }
      });
  
      if (!existingDoctor) {
        return NextResponse.json({ error: "Doctor Not Found" }, { status: 404 });
      }
  
      // حذف الدكتور
      await db.user.delete({
        where: { id: id }
      });
  
      return NextResponse.json({ 
        success: true, 
        message: "تم حذف الدكتور بنجاح" 
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return NextResponse.json({ error: "Error deleting doctor" }, { status: 500 });
    }
  }

  export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // 1. استخراج الآي دي بنفس الطريقة الصحيحة
      const { id } = await params;
  
      if (!id) {
        return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
      }
  
      // 2. قراءة البيانات المرسلة من الواجهة الأمامية
      const body = await req.json();
      const { name, username, password } = body;
  
      // 3. تجهيز البيانات التي سيتم تحديثها
      const updateData: any = {
        name: name,
        username: username,
      };
  
      // تحديث الباسورد فقط إذا قام المستخدم بكتابة باسورد جديد
      if (password && password.trim() !== "") {
        updateData.password = password; 
      }
  
      // 4. التحديث في قاعدة البيانات
      const updatedDoctor = await db.user.update({
        where: { id: id },
        data: updateData,
      });
  
      // 5. إرجاع رسالة النجاح
      return NextResponse.json({ 
        success: true, 
        message: "تم تعديل بيانات الدكتور بنجاح",
        doctor: updatedDoctor
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating doctor:", error);
      return NextResponse.json({ error: "حدث خطأ أثناء التعديل" }, { status: 500 });
    }
  }