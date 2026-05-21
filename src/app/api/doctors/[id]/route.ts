import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // استخدمت db بناءً على رسالة الخطأ لديك
import bcrypt from 'bcrypt';

// تعديل بيانات دكتور
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. إضافة await هنا لفك الـ Promise الخاص بالـ params
    const { id } = await params; 
    
    const body = await req.json();
    const { username, name, password } = body;

    // تجهيز البيانات التي سيتم تحديثها
    let updateData: any = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    
    // إذا تم إرسال كلمة مرور جديدة، قم بتشفيرها
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedDoctor = await db.user.update({
      where: { 
        id,
        role: 'DOCTOR', // لضمان عدم تعديل حسابات المدراء عن طريق الخطأ
      },
      data: updateData,
    });

    const { password: _, ...doctorData } = updatedDoctor;
    return NextResponse.json(doctorData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تعديل بيانات الدكتور' }, { status: 500 });
  }
}

// حذف دكتور
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 2. إضافة await هنا أيضاً
    const { id } = await params;

    await db.user.delete({
      where: { 
        id,
        role: 'DOCTOR',
      },
    });

    return NextResponse.json({ message: 'تم حذف الدكتور بنجاح' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    
    // معالجة خطأ Prisma في حال كان الدكتور مرتبطاً بمرضى
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'لا يمكن حذف الدكتور لوجود مرضى مرتبطين به. قم بنقل المرضى لدكتور آخر أولاً.' }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الدكتور' }, { status: 500 });
  }
}